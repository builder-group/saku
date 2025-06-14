import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { db, shopAccountTable } from '@/environment/db';
import type { TShopifySessionDto } from '../schema';
import { parseSessionId } from './parse-session-id';

export async function getShopifySession(sessionId: string): Promise<TShopifySessionDto> {
	// Extract shop domain from session ID
	const sessionData = parseSessionId(sessionId);
	if (sessionData == null) {
		throw new AppError('#ERR_INVALID_SESSION_ID', 400, {
			detail: 'Invalid session ID format'
		});
	}
	const { shopDomain: providerAccountId } = sessionData;

	const shopAccount = await db
		.select({
			userId: shopAccountTable.userId,
			providerData: shopAccountTable.providerData,
			createdAt: shopAccountTable.createdAt
		})
		.from(shopAccountTable)
		.where(
			and(
				eq(shopAccountTable.provider, 'shopify'),
				eq(shopAccountTable.providerAccountId, providerAccountId)
			)
		)
		.limit(1);

	if (!shopAccount.length) {
		throw new AppError('#ERR_SESSION_NOT_FOUND', 404, {
			detail: 'Shopify session not found'
		});
	}

	const providerData = shopAccount[0]?.providerData;
	if (providerData == null) {
		throw new AppError('#ERR_INVALID_SESSION_DATA', 500, {
			detail: 'Invalid session data'
		});
	}

	const isOnline = sessionData.type === 'online';
	const sessionInfo = isOnline ? providerData.onlineSession : providerData.offlineSession;
	if (sessionInfo == null) {
		throw new AppError('#ERR_SESSION_TYPE_NOT_FOUND', 404, {
			detail: `${isOnline ? 'Online' : 'Offline'} session not found for shop: ${providerAccountId}`
		});
	}

	return {
		id: sessionId,
		shop: providerAccountId,
		state: sessionInfo.state,
		isOnline,
		scope: sessionInfo.scopes,
		expires: isOnline && 'expiresAt' in sessionInfo ? (sessionInfo.expiresAt as string) : null,
		accessToken: sessionInfo.accessToken,
		onlineAccessInfo:
			isOnline && providerData.installer != null
				? {
						associated_user: {
							id: parseInt(providerData.installer.shopifyId),
							first_name: providerData.installer.firstName,
							last_name: providerData.installer.lastName,
							email: providerData.installer.email,
							account_owner: providerData.installer.isOwner,
							locale: providerData.installer.locale,
							collaborator: providerData.installer.isCollaborator,
							email_verified: providerData.installer.emailVerified
						}
					}
				: null
	};
}
