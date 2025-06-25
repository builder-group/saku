import type { ActionFunctionArgs } from '@remix-run/node';
import { shopify } from '@/environment/.server';

export const action = async ({ request }: ActionFunctionArgs) => {
	const { shop, session, topic } = await shopify.authenticate.webhook(request);

	console.log(`Received ${topic} webhook for ${shop}`);

	// Webhook requests can trigger multiple times and after an app has already been uninstalled.
	// If this webhook already ran, the session may have been deleted previously.
	if (session != null) {
		const sessions = await shopify.sessionStorage.findSessionsByShop(shop);
		await shopify.sessionStorage.deleteSessions(sessions.map((s) => s.id));
	}

	return new Response();
};
