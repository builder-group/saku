import { shopify } from '../../environment/.server';
import { TLoaderFunction } from '../../types';

export const loader: TLoaderFunction = async ({ request }) => {
	await shopify.authenticate.admin(request);

	return null;
};
