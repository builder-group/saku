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
