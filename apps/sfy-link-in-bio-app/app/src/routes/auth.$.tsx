import { authenticate } from '../shopify.server';
import { TLoaderFunction } from '../types';

export const loader: TLoaderFunction = async ({ request }) => {
	await authenticate.admin(request);

	return null;
};
