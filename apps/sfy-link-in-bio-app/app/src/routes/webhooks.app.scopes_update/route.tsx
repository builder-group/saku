import type { ActionFunctionArgs } from '@remix-run/node';
import { shopify } from '../../environment/.server';

export const action = async ({ request }: ActionFunctionArgs) => {
	const { payload, session, topic, shop } = await shopify.authenticate.webhook(request);

	console.log(`Received ${topic} webhook for ${shop}`);

	const current = payload['current'] as string[];
	if (session != null) {
		const sessions = await shopify.sessionStorage.findSessionsByShop(shop);
		for (const session of sessions) {
			session.scope = current.join(',');
			await shopify.sessionStorage.storeSession(session);
		}
	}

	return new Response();
};
