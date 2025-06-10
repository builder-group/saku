import { type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { AppProxyProvider } from '@shopify/shopify-app-remix/react';
import React from 'react';
import { authenticate } from '../shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
	await authenticate.public.appProxy(request);

	return { appUrl: process.env['SHOPIFY_APP_URL']! };
}

const Page: React.FC = () => {
	const { appUrl } = useLoaderData<typeof loader>();
	const [count, setCount] = React.useState(0);

	return (
		<AppProxyProvider appUrl={appUrl}>
			<div>
				<p>You clicked {count} times</p>
				<button onClick={() => setCount(count + 1)}>Click me</button>
			</div>
		</AppProxyProvider>
	);
};

export default Page;
