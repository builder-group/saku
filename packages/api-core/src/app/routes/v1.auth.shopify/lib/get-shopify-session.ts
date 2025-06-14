import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import { db, shopAccountTable, shopifySessionTable } from '@/environment/db';
import type { TShopifySessionDto } from '../schema';

export async function getShopifySession(sessionId: string): Promise<TShopifySessionDto> {
	// Get session
	const sessions = await db
		.select()
		.from(shopifySessionTable)
		.where(eq(shopifySessionTable.sessionId, sessionId))
		.limit(1);
	const session = sessions[0];
	if (session == null) {
		throw new AppError('#ERR_SESSION_NOT_FOUND', 404, {
			detail: 'Shopify session not found'
		});
	}

	// Build base session response
	const sessionDto: TShopifySessionDto = {
		id: session.sessionId,
		shop: session.shopId,
		state: session.state,
		isOnline: session.isOnline,
		scope: session.scopes,
		expires: session.expiresAt?.toISOString() ?? null,
		accessToken: session.accessToken,
		onlineAccessInfo: null
	};

	// For online sessions, get installer data from shop account
	if (session.isOnline) {
		const shopAccounts = await db
			.select({
				providerData: shopAccountTable.providerData
			})
			.from(shopAccountTable)
			.where(
				and(
					eq(shopAccountTable.provider, 'shopify'),
					eq(shopAccountTable.providerAccountId, session.shopId)
				)
			)
			.limit(1);
		const installer = shopAccounts[0]?.providerData?.installer;

		if (installer != null) {
			sessionDto.onlineAccessInfo = {
				associated_user: {
					id: parseInt(installer.shopifyId),
					first_name: installer.firstName,
					last_name: installer.lastName,
					email: installer.email,
					account_owner: installer.isOwner,
					locale: installer.locale,
					collaborator: installer.isCollaborator,
					email_verified: installer.emailVerified
				}
			};
		}
	}

	return sessionDto;
}
