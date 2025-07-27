import { boundary } from '@shopify/shopify-app-react-router/server';
import { shopify } from '@/environment/.server';
import { THeadersFunction, TLoaderFunction } from '@/types';

export const loader: TLoaderFunction = async ({ request }) => {
	await shopify.authenticate.admin(request);

	return null;
};

export const headers: THeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};
