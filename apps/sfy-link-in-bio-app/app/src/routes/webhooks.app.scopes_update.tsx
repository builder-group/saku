import type { ActionFunctionArgs } from '@remix-run/node';
import { authenticate, shopifySessionStorage } from '../shopify.server';

export const action = async ({ request }: ActionFunctionArgs) => {
	const { payload, session, topic, shop } = await authenticate.webhook(request);

	console.log(`Received ${topic} webhook for ${shop}`);

	const current = payload['current'] as string[];
	if (session != null) {
		const sessions = await shopifySessionStorage.findSessionsByShop(shop);
		for (const session of sessions) {
			session.scope = current.toString();
			await shopifySessionStorage.storeSession(session);
		}
	}

	return new Response();
};
