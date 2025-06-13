// Only load .env in development (for db credentials)
const nodeEnv = process.env['NODE_ENV'] ?? 'local';
if (nodeEnv === 'local') {
	const dotenv = require('dotenv');
	dotenv.config({ path: `.env.${nodeEnv}` });
	console.log(`Loaded dotenv from '.env.${nodeEnv}'.`);
}

/** @type { import("drizzle-kit").Config } */
module.exports = {
	schema: './src/environment/db/schemas/index.ts',
	out: './drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env['DB_URL']
	},
	verbose: true,
	strict: true
};
