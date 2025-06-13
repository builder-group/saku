import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { dbConfig } from '../configs';
import * as schema from './schemas';

const pool = new Pool({
	connectionString: dbConfig.url
});
export const db = drizzle({ client: pool });

export * from './schemas';
export { schema };
