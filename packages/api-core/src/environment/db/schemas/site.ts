import { jsonb, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { workspaceTable } from './workspace';

/**
 * Sites represent individual web presences within a workspace.
 * Examples: link-in-bio page, landing page, product showcase.
 *
 * Sites have access to all accounts connected to their workspace.
 */
export const siteTable = pgTable(
	'site',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		// Parent workspace (business entity)
		workspaceId: text('workspace_id')
			.notNull()
			.references(() => workspaceTable.id, { onDelete: 'cascade' }),

		// Public-facing and URL-friendly handle/slug (e.g. /bio, /shop)
		handle: text('handle').notNull(),
		// Human-friendly site name
		displayName: text('display_name'),

		// Site content
		content: jsonb('content').$type<Record<string, unknown>>().notNull(),

		// Publishing status
		// isPublished: text('is_published')
		// 	.$type<boolean>()
		// 	.$default(() => false),
		// publishedAt: timestamp('published_at', { mode: 'date' }),

		updatedAt: timestamp('updated_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date()),
		createdAt: timestamp('created_at', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [
		// Make handle unique per workspace
		unique('handle_per_workspace_idx').on(table.workspaceId, table.handle)
	]
);
