const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { Pool } = require('pg');

// Only load .env in development
const nodeEnv = process.env.NODE_ENV ?? 'local';
if (nodeEnv === 'local') {
	require('dotenv').config({ path: `.env.${nodeEnv}` });
	console.log(`Loaded dotenv from '.env.${nodeEnv}'.`);
}

(async () => {
	const dbUrl = process.env.DB_URL;
	if (dbUrl == null) {
		throw Error('Failed to resolve database url!');
	}

	const pool = new Pool({
		connectionString: dbUrl,
		max: 1
	});

	try {
		await migrate(drizzle(pool), {
			migrationsFolder: './drizzle/migrations'
		});
	} finally {
		await pool.end();
	}
})().catch((e) => {
	console.error('Failed to run database migrations by exception: ', e);
});
