// Load .env for db credentials
const nodeEnv = process.env['NODE_ENV'] ?? 'local';
require('dotenv').config({ path: `.env.${nodeEnv}` });
console.log(`Loaded dotenv from '.env.${nodeEnv}'.`);

/** @type { import("drizzle-kit").Config } */
module.exports = {
	schema: './src/environment/db/schemas/index.ts',
	out: './drizzle/migrations/local',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env['DB_URL']
	},
	verbose: true,
	strict: true
};
