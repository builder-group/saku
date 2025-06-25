import { eq } from 'drizzle-orm';
import { router } from '@/app/router';
import { db, logger, shopifySessionTable, siteAccountTable } from '@/environment';
import { verifyShopifyWebhook } from '@/lib';
import {
	CustomersDataRequestWebhookRoute,
	CustomersRedactWebhookRoute,
	ShopRedactWebhookRoute
} from './schema';

// https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#customers-data_request
router.openapi(CustomersDataRequestWebhookRoute, async (c) => {
	await verifyShopifyWebhook(c);
	const input = c.req.valid('json');

	logger.info(
		`Received customers/data_request webhook for shop: ${input.shop_domain} (ID: ${input.shop_id})`
	);
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
	await verifyShopifyWebhook(c);
	const input = c.req.valid('json');

	logger.info(
		`Received customers/redact webhook for shop: ${input.shop_domain} (ID: ${input.shop_id})`
	);
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
	await verifyShopifyWebhook(c);
	const input = c.req.valid('json');

	logger.info(`Received shop/redact webhook for shop: ${input.shop_domain} (ID: ${input.shop_id})`);

	// Delete all data related to this shop
	// This happens 48 hours after app uninstallation

	// 1. Delete Shopify sessions for this shop
	await db.delete(shopifySessionTable).where(eq(shopifySessionTable.shopId, input.shop_domain));

	// 2. Delete shop account data (this will cascade delete site connections, .. automatically)
	await db
		.delete(siteAccountTable)
		.where(
			eq(siteAccountTable.provider, 'shopify') &&
				eq(siteAccountTable.providerAccountId, input.shop_domain)
		);

	// Note: We do NOT delete user accounts in shop/redact
	// - Users may have multiple shops
	// - Users may reconnect the same shop later
	// - Privacy laws require explicit consent for account deletion
	// - This webhook is about shop data, not user account deletion

	logger.info(`Deleted all data for shop: ${input.shop_domain}`);

	return c.json(
		{
			message: 'Shop redaction webhook received and processed'
		},
		200
	);
});
