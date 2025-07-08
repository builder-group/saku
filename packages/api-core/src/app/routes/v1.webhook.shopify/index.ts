import { and, eq } from 'drizzle-orm';
import { router } from '@/app/router';
import {
	db,
	logger,
	shopifySessionTable,
	workspaceAccountTable,
	workspaceTable
} from '@/environment';
import {
	createHandleFromShop,
	getShopifyShopAccessToken,
	removeAppProxyRedirects,
	verifyShopifyWebhook
} from '@/lib';
import {
	AppScopesUpdateWebhookRoute,
	AppUninstalledWebhookRoute,
	CustomersDataRequestWebhookRoute,
	CustomersRedactWebhookRoute,
	ShopRedactWebhookRoute
} from './schema';

// https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#customers-data_request
router.openapi(CustomersDataRequestWebhookRoute, async (c) => {
	const { shopDomain, topic, eventId } = await verifyShopifyWebhook(c);
	const input = c.req.valid('json');

	logger.info(`Received ${topic} webhook for shop: ${shopDomain} (Event: ${eventId})`);
	logger.info(`Customer: ${input.customer.email} (ID: ${input.customer.id})`);

	// We don't currently store customer data (merchant's shoppers), so no data to provide
	// This webhook is required for App Store compliance even if no customer data is collected
	// If we add customer data storage in the future, implement data collection logic here

	return c.json(
		{
			message: 'Data request webhook received and processed'
		},
		200
	);
});

// https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#customers-redact
router.openapi(CustomersRedactWebhookRoute, async (c) => {
	const { shopDomain, topic, eventId } = await verifyShopifyWebhook(c);
	const input = c.req.valid('json');

	logger.info(`Received ${topic} webhook for shop: ${shopDomain} (Event: ${eventId})`);
	logger.info(`Customer to redact: ${input.customer.email} (ID: ${input.customer.id})`);

	// We don't currently store customer data (merchant's shoppers), so no redaction needed
	// This webhook is required for App Store compliance even if no customer data is collected
	// If we add customer data storage in the future, implement redaction logic here

	return c.json(
		{
			message: 'Customer redaction webhook received and processed'
		},
		200
	);
});

// https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#shop-redact
router.openapi(ShopRedactWebhookRoute, async (c) => {
	const { shopDomain, topic, eventId } = await verifyShopifyWebhook(c);

	logger.info(`Received ${topic} webhook for shop: ${shopDomain} (Event: ${eventId})`);

	// Delete all data related to this shop
	// This happens 48 hours after app uninstallation

	// 1. Delete Shopify sessions for this shop
	const deletedSessions = await db
		.delete(shopifySessionTable)
		.where(eq(shopifySessionTable.shopId, shopDomain))
		.returning({ sessionId: shopifySessionTable.sessionId });

	logger.info(`Deleted ${deletedSessions.length} Shopify sessions for shop: ${shopDomain}`);

	// 2. Delete workspace account data (Shopify store connection)
	const deletedShopifyAccounts = await db
		.delete(workspaceAccountTable)
		.where(
			and(
				eq(workspaceAccountTable.provider, 'shopify'),
				eq(workspaceAccountTable.providerAccountId, shopDomain)
			)
		)
		.returning({ workspaceId: workspaceAccountTable.workspaceId });

	logger.info(
		`Deleted ${deletedShopifyAccounts.length} workspace accounts for shop: ${shopDomain}`
	);

	const shopHandle = createHandleFromShop(shopDomain);

	// 3. Delete workspace if it was created specifically for this Shopify store
	// and no other accounts are connected to it
	// Note: Currently, workspace = single Shopify store (1:1 relationship)
	// While the schema supports multiple stores per workspace (future SaaS),
	// we currently enforce 1 store = 1 workspace for simplicity.
	// This is enforced by setting the workspace handle to the shop handle.
	for (const deletedShopifyAccount of deletedShopifyAccounts) {
		const workspaceId = deletedShopifyAccount.workspaceId;

		// Get workspace info and remaining account count
		const [workspace] = await db
			.select({
				id: workspaceTable.id,
				remainingAccountCount: db.$count(
					workspaceAccountTable,
					eq(workspaceAccountTable.workspaceId, workspaceId)
				)
			})
			.from(workspaceTable)
			.where(and(eq(workspaceTable.id, workspaceId), eq(workspaceTable.handle, shopHandle)))
			.limit(1);

		// Only delete if workspace exists with correct handle and has no remaining accounts
		// Note: Shopify account was deleted in the previous step
		// Note: This will cascade delete: sites, workspace members, and all related content
		if (workspace != null && workspace.remainingAccountCount === 0) {
			await db.delete(workspaceTable).where(eq(workspaceTable.id, workspaceId));
			logger.info(
				`Deleted workspace and all associated data for shop: ${shopDomain} (ID: ${workspaceId}, handle: ${shopHandle})`
			);
			logger.info(`  - Cascade deleted: sites, workspace members, site content`);
		}
	}

	// Note: We do NOT delete user accounts in shop/redact
	// - Users may have multiple shops/workspaces
	// - Users may reconnect the same shop later
	// - Privacy laws require explicit consent for account deletion
	// - This webhook is about shop data, not user account deletion

	logger.info(`Shop redaction completed for: ${shopDomain}`);

	return c.json(
		{
			message: 'Shop redaction webhook received and processed'
		},
		200
	);
});

// https://shopify.dev/docs/api/webhooks?reference=toml#list-of-topics-app/uninstalled
router.openapi(AppUninstalledWebhookRoute, async (c) => {
	const { shopDomain, topic, eventId } = await verifyShopifyWebhook(c);
	const input = c.req.valid('json');

	logger.info(`Received ${topic} webhook for shop: ${input.name} (${shopDomain})`);
	logger.info(`Shop ID: ${input.id}, Plan: ${input.plan_display_name} (Event: ${eventId})`);

	const accessToken = await getShopifyShopAccessToken(shopDomain);

	// Delete all redirects that target the app proxy path
	const deletedRedirects = await removeAppProxyRedirects({
		shopId: shopDomain,
		accessToken
	});
	if (deletedRedirects.isErr()) {
		logger.error(`Error deleting redirects: ${deletedRedirects.error}`);
	} else {
		logger.info(
			`Deleted ${deletedRedirects.value.redirectsDeleted} redirects for shop: ${shopDomain}`
		);
	}

	// Delete Shopify sessions immediately when app is uninstalled
	// This prevents access token usage after uninstallation
	const deletedSessions = await db
		.delete(shopifySessionTable)
		.where(eq(shopifySessionTable.shopId, shopDomain))
		.returning({ sessionId: shopifySessionTable.sessionId });

	logger.info(`Deleted ${deletedSessions.length} Shopify sessions for shop: ${shopDomain}`);

	// Note: We do NOT delete shop account data here
	// - Shop data deletion happens in shop/redact webhook (48 hours later)
	// - This allows merchants to reinstall the app and keep their data
	// - Follows Shopify's recommended uninstall flow

	return c.json(
		{
			message: 'App uninstalled webhook received and processed'
		},
		200
	);
});

// https://shopify.dev/docs/api/webhooks?reference=toml#list-of-topics-app/scopes_update
router.openapi(AppScopesUpdateWebhookRoute, async (c) => {
	const { shopDomain, topic, eventId } = await verifyShopifyWebhook(c);
	const input = c.req.valid('json');

	logger.info(`Received ${topic} webhook for shop: ${shopDomain} (Event: ${eventId})`);
	logger.info(`Shop ID: ${input.id}`);
	logger.info(`Previous scopes: ${input.previous.join(', ')}`);
	logger.info(`Current scopes: ${input.current.join(', ')}`);

	// Update scopes for all sessions of this shop
	const newScopesString = input.current.join(',');

	const updatedSessions = await db
		.update(shopifySessionTable)
		.set({
			scopes: newScopesString,
			updatedAt: new Date()
		})
		.where(eq(shopifySessionTable.shopId, shopDomain))
		.returning({ sessionId: shopifySessionTable.sessionId });

	logger.info(`Updated scopes for ${updatedSessions.length} sessions of shop: ${shopDomain}`);

	return c.json(
		{
			message: 'App scopes update webhook received and processed'
		},
		200
	);
});
