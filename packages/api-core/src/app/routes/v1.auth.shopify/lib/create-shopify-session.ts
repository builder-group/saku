import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import {
	db,
	shopifySessionTable,
	siteAccountTable,
	siteConnectionTable,
	siteTable,
	TEmailOTPUserProviderData,
	TTransaction as TPgTransaction,
	TShopifySessionData,
	TSiteProviderData,
	userAccountTable,
	userTable
} from '@/environment';
import type { TShopifySessionDto } from '../schema';
import { createDisplayNameFromShop } from './create-display-name-from-shop';
import { createHandleFromEmail } from './create-handle-from-email';

export async function createShopifySession(session: TShopifySessionDto): Promise<void> {
	await db.transaction(async (tx) => {
		// 1. Store session data (works for both online and offline)
		await upsertSession(tx, session);

		// 2. Create user, site account, and shop site if online session
		if (session.isOnline) {
			await upsertUserAndSiteAccount(tx, session);
		}

		return session;
	});
}

async function upsertSession(tx: TPgTransaction, session: TShopifySessionDto): Promise<void> {
	const sessionData: TShopifySessionData = {};
	if (session.isOnline && session.onlineAccessInfo != null) {
		sessionData.onlineAccessInfo = {
			associatedUser: {
				id: session.onlineAccessInfo.associated_user.id,
				firstName: session.onlineAccessInfo.associated_user.first_name,
				lastName: session.onlineAccessInfo.associated_user.last_name,
				email: session.onlineAccessInfo.associated_user.email,
				emailVerified: session.onlineAccessInfo.associated_user.email_verified,
				accountOwner: session.onlineAccessInfo.associated_user.account_owner,
				locale: session.onlineAccessInfo.associated_user.locale,
				collaborator: session.onlineAccessInfo.associated_user.collaborator
			},
			associatedUserScope: session.onlineAccessInfo.associated_user_scope,
			expiresIn: session.onlineAccessInfo.expires_in,
			session: session.onlineAccessInfo.session,
			accountNumber: session.onlineAccessInfo.account_number ?? undefined
		};
	}

	await tx
		.insert(shopifySessionTable)
		.values({
			sessionId: session.id,
			shopId: session.shop,
			isOnline: session.isOnline,
			accessToken: session.accessToken,
			scopes: session.scope,
			state: session.state,
			expiresAt: session.expires != null ? new Date(session.expires) : null,
			sessionData,
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.onConflictDoUpdate({
			target: shopifySessionTable.sessionId,
			set: {
				shopId: session.shop,
				isOnline: session.isOnline,
				accessToken: session.accessToken,
				scopes: session.scope,
				state: session.state,
				expiresAt: session.expires != null ? new Date(session.expires) : null,
				sessionData,
				updatedAt: new Date()
			}
		});
}

async function upsertUserAndSiteAccount(
	tx: TPgTransaction,
	session: TShopifySessionDto
): Promise<void> {
	const associatedUser = session.onlineAccessInfo?.associated_user;
	if (associatedUser == null) {
		return;
	}

	// 1. Find existing user by email
	let [user] = await tx
		.select({
			id: userTable.id
		})
		.from(userTable)
		.where(eq(userTable.email, associatedUser.email))
		.limit(1);

	// 2. Create user and OTP account if they don't exist
	if (user == null) {
		// Create user
		[user] = await tx
			.insert(userTable)
			.values({
				handle: createHandleFromEmail(associatedUser.email),
				displayName: `${associatedUser.first_name} ${associatedUser.last_name}`,
				email: associatedUser.email,
				emailVerifiedAt: associatedUser.email_verified ? new Date() : null,
				updatedAt: new Date(),
				createdAt: new Date()
			})
			.returning({
				id: userTable.id
			});
		if (user == null) {
			throw new AppError('#ERR_USER_CREATE_FAILED', 500, {
				detail: 'Failed to create user'
			});
		}

		// Create OTP account for future login
		await tx
			.insert(userAccountTable)
			.values({
				userId: user.id,
				accountType: 'otp',
				provider: 'email',
				providerAccountId: associatedUser.email,
				providerData: {} satisfies TEmailOTPUserProviderData,
				updatedAt: new Date(),
				createdAt: new Date()
			})
			.onConflictDoNothing();
	}

	// 3. Check if shop is already connected to a different user
	const [existingSiteAccount] = await tx
		.select({
			userId: siteAccountTable.userId
		})
		.from(siteAccountTable)
		.where(
			and(
				eq(siteAccountTable.provider, 'shopify'),
				eq(siteAccountTable.providerAccountId, session.shop)
			)
		)
		.limit(1);
	if (existingSiteAccount != null && existingSiteAccount.userId !== user.id) {
		throw new AppError('#ERR_SHOP_ALREADY_CONNECTED', 409, {
			detail: `Shop ${session.shop} is already connected to another account. Please disconnect the existing connection first before connecting to a new account.`
		});
	}

	// 4. Create/update site account and shop site
	const isNewShop = existingSiteAccount == null;

	// Create/update site account
	await tx
		.insert(siteAccountTable)
		.values({
			userId: user.id,
			accountType: 'oauth',
			provider: 'shopify',
			providerAccountId: session.shop,
			providerData: {
				installer: {
					shopifyId: associatedUser.id.toString(),
					firstName: associatedUser.first_name,
					lastName: associatedUser.last_name,
					email: associatedUser.email,
					emailVerified: associatedUser.email_verified,
					isOwner: associatedUser.account_owner,
					locale: associatedUser.locale,
					isCollaborator: associatedUser.collaborator
				}
			} satisfies TSiteProviderData,
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.onConflictDoUpdate({
			target: [siteAccountTable.provider, siteAccountTable.providerAccountId],
			set: {
				providerData: {
					installer: {
						shopifyId: associatedUser.id.toString(),
						firstName: associatedUser.first_name,
						lastName: associatedUser.last_name,
						email: associatedUser.email,
						emailVerified: associatedUser.email_verified,
						isOwner: associatedUser.account_owner,
						locale: associatedUser.locale,
						isCollaborator: associatedUser.collaborator
					}
				},
				updatedAt: new Date()
			}
		});

	// Create bio site and connection if it's a new shop
	if (isNewShop) {
		// Create shop site
		const [site] = await tx
			.insert(siteTable)
			.values({
				userId: user.id,
				handle: 'bio',
				displayName: `${createDisplayNameFromShop(session.shop)} Bio`,
				content: {}, // Empty content to start
				updatedAt: new Date(),
				createdAt: new Date()
			})
			.returning({
				id: siteTable.id
			});
		if (site == null) {
			throw new AppError('#ERR_SITE_CREATE_FAILED', 500, {
				detail: 'Failed to create site'
			});
		}

		// Connect bio site to Shopify store
		await tx
			.insert(siteConnectionTable)
			.values({
				siteId: site.id,
				provider: 'shopify',
				providerAccountId: session.shop,
				updatedAt: new Date(),
				createdAt: new Date()
			})
			.onConflictDoNothing();
	}
}
