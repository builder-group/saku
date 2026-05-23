import { and, eq } from 'drizzle-orm';
import { router } from '@/app/router';
import {
	db,
	logger,
	redisClient,
	shopifySessionTable,
	siteTable,
	workspaceAccountTable
} from '@/environment';
import { cleanupShopData, sendUninstallFeedbackEmail, verifyShopifyWebhook } from '@/lib';
import {
	AppScopesUpdateWebhookRoute,
	AppUninstalledWebhookRoute,
	CustomersDataRequestWebhookRoute,
	CustomersRedactWebhookRoute,
	ShopRedactWebhookRoute
} from './schema';

// https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#customers-data_request
router.openapi(CustomersDataRequestWebhookRoute, async (c) => {
	const { shopDomain, topic, eventId } = (await verifyShopifyWebhook(c)).unwrap();
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
	const { shopDomain, topic, eventId } = (await verifyShopifyWebhook(c)).unwrap();
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
	const { shopDomain, topic, eventId } = (await verifyShopifyWebhook(c)).unwrap();

	logger.info(`Received ${topic} webhook for shop: ${shopDomain} (Event: ${eventId})`);

	// Delete all data related to this shop
	// This happens 48 hours after app uninstallation

	await cleanupShopData(shopDomain);

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
	const { shopDomain, topic, eventId } = (await verifyShopifyWebhook(c)).unwrap();
	const input = c.req.valid('json');

	logger.info(`Received ${topic} webhook for shop: ${input.name} (${shopDomain})`);
	logger.info(`Shop ID: ${input.id}, Plan: ${input.plan_display_name} (Event: ${eventId})`);

	// NOTE: Access tokens are immediately revoked when the app is uninstalled
	// This means we cannot perform cleanup actions that require API access (like removing redirects) here

	// Delete Shopify sessions immediately when app is uninstalled
	// This prevents (invalid) access token usage after uninstallation
	const deletedSessions = await db
		.delete(shopifySessionTable)
		.where(eq(shopifySessionTable.shopId, shopDomain))
		.returning({ sessionId: shopifySessionTable.sessionId });

	for (const session of deletedSessions) {
		await redisClient.deleteShopifySession(session.sessionId);
	}
	await redisClient.deleteShopifySessionsByShop(shopDomain);

	logger.info(`Deleted ${deletedSessions.length} Shopify sessions for shop: ${shopDomain}`);

	// Continue only if sessions were deleted (i.e. hook wasn't triggered earlier)
	if (deletedSessions.length > 0) {
		// Get the workspace ID for this shop
		const [shopifyAccount] = await db
			.select({
				workspaceId: workspaceAccountTable.workspaceId
			})
			.from(workspaceAccountTable)
			.where(
				and(
					eq(workspaceAccountTable.provider, 'shopify'),
					eq(workspaceAccountTable.providerAccountId, shopDomain)
				)
			)
			.limit(1);

		// Get all link-in-bio pages for this workspace
		const sites =
			shopifyAccount != null
				? await db
						.select({
							handle: siteTable.handle
						})
						.from(siteTable)
						.where(eq(siteTable.workspaceId, shopifyAccount.workspaceId))
				: [];

		// Format URLs as shopDomain/handle
		const linkInBioPages = sites.map((site) => `${shopDomain}/${site.handle}`);

		const sendUninstallFeedbackEmailResult = await sendUninstallFeedbackEmail({
			email: input.email,
			shopName: input.name,
			linkInBioPages,
			totalVisits: 0, // TODO: Add analytics tracking
			feedbackUrl: '' // TODO: Add feedback URL
		});
		if (sendUninstallFeedbackEmailResult.isErr()) {
			logger.error(
				`Error sending uninstall feedback email for shop: ${shopDomain}`,
				sendUninstallFeedbackEmailResult.error
			);
		}
	}

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
	const { shopDomain, topic, eventId } = (await verifyShopifyWebhook(c)).unwrap();
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

	// Invalidate Redis cache for updated sessions
	for (const session of updatedSessions) {
		await redisClient.deleteShopifySession(session.sessionId);
	}
	await redisClient.deleteShopifySessionsByShop(shopDomain);

	logger.info(`Updated scopes for ${updatedSessions.length} sessions of shop: ${shopDomain}`);

	return c.json(
		{
			message: 'App scopes update webhook received and processed'
		},
		200
	);
});
