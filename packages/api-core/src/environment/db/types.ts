import { ExtractTablesWithRelations } from 'drizzle-orm';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres/session';
import { PgTransaction } from 'drizzle-orm/pg-core';

export type TTransaction = PgTransaction<
	NodePgQueryResultHKT,
	Record<string, never>,
	ExtractTablesWithRelations<Record<string, never>>
>;
