import { type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { AppProxyProvider } from '@shopify/shopify-app-remix/react';
import React from 'react';
import { shopify, shopifyConfig } from '../../environment/.server';

export async function loader({ request }: LoaderFunctionArgs) {
	await shopify.authenticate.public.appProxy(request);

	return { appUrl: shopifyConfig.appUrl };
}

const Page: React.FC = () => {
	const { appUrl } = useLoaderData<typeof loader>();
	const [count, setCount] = React.useState(0);

	return (
		<AppProxyProvider appUrl={appUrl}>
			{/*
			 * Manual CSS injection with absolute URL is required for app proxy routes.
			 *
			 * Why we can't use Remix's `links` export:
			 * - App proxy routes run on Shopify store domain (e.g. shop.myshopify.com/a/bio)
			 * - But CSS/JS resources must load from our app domain (e.g. our-app.com)
			 * - Remix's `links` export is processed before AppProxyProvider runs
			 * - So the `<base href>` set by AppProxyProvider doesn't affect links
			 * - Result: `links` tries to load CSS from shop.myshopify.com/src/styles.css (404)
			 *
			 * TODO: Figure out how to stop loading `styles.css` from `shop.myshopify.com/src/styles.css`.
			 * TODO: Figure out better solution for this.
			 */}
			<link rel="stylesheet" href={`${appUrl}/src/styles.css`} />

			<div className="mx-auto max-w-lg rounded-lg bg-red-100 p-4">
				<h1 className="mb-4 text-xl font-bold">Bio Link Page</h1>
				<p className="mb-4">You clicked {count} times</p>
				<button
					onClick={() => setCount(count + 1)}
					className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
				>
					Click me
				</button>
			</div>
		</AppProxyProvider>
	);
};

export default Page;
