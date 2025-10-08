import { TFlatSite } from '@repo/editor';
import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { db, siteTable, workspaceTable } from '@/environment';

export async function parseSakuSite(url: URL): Promise<TSakuSiteData> {
	const pathname = url.pathname;

	// Parse saku.so URL format: /w/{workspaceHandle}/{siteHandle}
	const pathParts = pathname.split('/').filter(Boolean);
	if (pathParts.length < 3 || pathParts[0] !== 'w') {
		throw new AppError('#ERR_INVALID_SAKU_URL_FORMAT', 400, {
			title: 'Invalid Saku URL format',
			detail: 'Saku URLs must follow the format: https://saku.so/w/{workspaceHandle}/{siteHandle}'
		});
	}

	const workspaceHandle = pathParts[1];
	const siteHandle = pathParts[2];
	if (workspaceHandle == null || siteHandle == null) {
		throw new AppError('#ERR_INVALID_SAKU_URL_FORMAT', 400, {
			title: 'Invalid Saku URL format',
			detail: 'Saku URLs must follow the format: https://saku.so/w/{workspaceHandle}/{siteHandle}'
		});
	}

	// Find workspace by handle
	const [workspace] = await db
		.select({ id: workspaceTable.id })
		.from(workspaceTable)
		.where(eq(workspaceTable.handle, workspaceHandle))
		.limit(1);
	if (workspace == null) {
		throw new AppError('#ERR_WORKSPACE_NOT_FOUND', 404, {
			title: 'Workspace not found',
			detail: `Workspace with handle '${workspaceHandle}' was not found`
		});
	}

	// Find site by handle and workspace id
	const [site] = await db
		.select({
			id: siteTable.id,
			content: siteTable.content,
			handle: siteTable.handle
		})
		.from(siteTable)
		.where(and(eq(siteTable.workspaceId, workspace.id), eq(siteTable.handle, siteHandle)))
		.limit(1);
	if (site == null) {
		throw new AppError('#ERR_SITE_NOT_FOUND', 404, {
			title: 'Site not found',
			detail: `Site with handle '${siteHandle}' not found in workspace '${workspaceHandle}'`
		});
	}
	const siteContent = site.content;

	// Clear integrations
	siteContent.integrations = {};

	// Apply watermark
	const rootNode = siteContent.nodes[siteContent.rootId];
	if (rootNode != null && rootNode.type === 'page') {
		rootNode.content.hasWatermark = true;
	}

	return {
		workspaceHandle,
		siteHandle,
		content: siteContent
	};
}

export interface TSakuSiteData {
	workspaceHandle: string;
	siteHandle: string;
	content: TFlatSite;
}
