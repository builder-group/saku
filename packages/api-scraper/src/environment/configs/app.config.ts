export const appConfig = {
	env: process.env['NODE_ENV']!,
	oxyLabs: {
		username: process.env['OXYLABS_USERNAME']!,
		password: process.env['OXYLABS_PASSWORD']!,
		endpoint: 'https://realtime.oxylabs.io/v1/queries'
	},
	x: {
		bearerToken: process.env['X_BEARER_TOKEN']!,
		apiEndpoint: 'https://api.twitter.com/2'
	}
};
