import { authenticate } from '../shopify.server';
import { TLoaderFunction } from '../types';

// Handle both GET and POST requests
export const loader: TLoaderFunction<Response> = async ({ request }) => {
	// Authenticate the app proxy request
	const { session } = await authenticate.public.appProxy(request);

	// Get query parameters from the request
	const url = new URL(request.url);
	const shop = url.searchParams.get('shop');
	const customerId = url.searchParams.get('logged_in_customer_id');

	console.log('App Proxy - Shop:', shop);
	console.log('App Proxy - Customer ID:', customerId);
	console.log('App Proxy - Session:', session);

	// Return HTML content
	const htmlContent = `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Link in Bio</title>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
		</head>
		<body>
			<h1>Hello World from App Proxy!</h1>
			<p>Shop: ${shop}</p>
			<p>Customer ID: ${customerId || 'Not logged in'}</p>
			<p>This is your link in bio page.</p>
		</body>
		</html>
	`;
	return new Response(htmlContent, {
		headers: {
			'Content-Type': 'text/html'
		}
	});
};

// export const action: TActionFunction = async (args) => {
// 	return null;
// };
