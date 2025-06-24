const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { Pool } = require('pg');
const minimist = require('minimist');

(async () => {
	const args = minimist(process.argv.slice(2), { boolean: ['local'] });

	let dbUrl;
	let migrationsFolder;

	// Local development - load dotenv and use local migrations
	if (args.local) {
		const nodeEnv = process.env['NODE_ENV'] ?? 'local';
		require('dotenv').config({ path: `.env.${nodeEnv}` });
		console.log(`Loaded dotenv from '.env.${nodeEnv}'.`);

		dbUrl = process.env['DB_URL'];
		migrationsFolder = './drizzle/migrations/local';
		console.log('Using local migrations directory.');
	}
	// Production - use environment variables and main migrations
	else {
		dbUrl = process.env['DB_URL'];
		migrationsFolder = './drizzle/migrations';
		console.log('Using production migrations directory.');
	}

	if (dbUrl == null) {
		console.error('No database URL found. Check your environment variables.');
		process.exit(1);
	}

	const pool = new Pool({
		connectionString: dbUrl,
		max: 1
	});

	try {
		console.log('Running database migrations...');
		await migrate(drizzle(pool), {
			migrationsFolder
		});
		console.log('Database migrations completed successfully.');
	} finally {
		await pool.end();
	}
})().catch((e) => {
	console.error('Failed to run database migrations by exception: ', e);
	process.exit(1);
});
