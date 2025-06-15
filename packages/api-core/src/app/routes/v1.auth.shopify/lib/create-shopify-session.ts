import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import {
	db,
	shopAccountTable,
	shopifySessionTable,
	TEmailOTPProviderData,
	TTransaction as TPgTransaction,
	TShopifyProviderData,
	TShopifySessionData,
	userAccountTable,
	userTable
} from '@/environment';
import type { TShopifySessionDto } from '../schema';
import { createHandleFromEmail } from './create-handle-from-email';

export async function createShopifySession(input: TShopifySessionDto): Promise<void> {
	await db.transaction(async (tx) => {
		// 1. Store session data (works for both online and offline)
		await upsertSession(tx, input);

		// 2. Create shop account + user if online session
		if (input.isOnline) {
			await upsertUserAndShopAccount(tx, input);
		}

		return input;
	});
}

async function upsertSession(tx: TPgTransaction, input: TShopifySessionDto): Promise<void> {
	const sessionData: TShopifySessionData = {};
	if (input.isOnline && input.onlineAccessInfo != null) {
		sessionData.onlineAccessInfo = {
			associatedUser: {
				id: input.onlineAccessInfo.associated_user.id,
				firstName: input.onlineAccessInfo.associated_user.first_name,
				lastName: input.onlineAccessInfo.associated_user.last_name,
				email: input.onlineAccessInfo.associated_user.email,
				emailVerified: input.onlineAccessInfo.associated_user.email_verified,
				accountOwner: input.onlineAccessInfo.associated_user.account_owner,
				locale: input.onlineAccessInfo.associated_user.locale,
				collaborator: input.onlineAccessInfo.associated_user.collaborator
			},
			associatedUserScope: input.onlineAccessInfo.associated_user_scope,
			expiresIn: input.onlineAccessInfo.expires_in,
			session: input.onlineAccessInfo.session,
			accountNumber: input.onlineAccessInfo.account_number ?? undefined
		};
	}

	await tx
		.insert(shopifySessionTable)
		.values({
			sessionId: input.id,
			shopId: input.shop,
			isOnline: input.isOnline,
			accessToken: input.accessToken,
			scopes: input.scope,
			state: input.state,
			expiresAt: input.expires != null ? new Date(input.expires) : null,
			sessionData,
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.onConflictDoUpdate({
			target: shopifySessionTable.sessionId,
			set: {
				shopId: input.shop,
				isOnline: input.isOnline,
				accessToken: input.accessToken,
				scopes: input.scope,
				state: input.state,
				expiresAt: input.expires != null ? new Date(input.expires) : null,
				sessionData,
				updatedAt: new Date()
			}
		});
}

async function upsertUserAndShopAccount(
	tx: TPgTransaction,
	input: TShopifySessionDto
): Promise<void> {
	const associatedUser = input.onlineAccessInfo?.associated_user;
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
				providerData: {} satisfies TEmailOTPProviderData,
				updatedAt: new Date(),
				createdAt: new Date()
			})
			.onConflictDoNothing();
	}

	// 3. Check if shop is already connected to a different user
	const [existingShopAccount] = await tx
		.select({
			userId: shopAccountTable.userId
		})
		.from(shopAccountTable)
		.where(
			and(
				eq(shopAccountTable.provider, 'shopify'),
				eq(shopAccountTable.providerAccountId, input.shop)
			)
		)
		.limit(1);
	if (existingShopAccount != null && existingShopAccount.userId !== user.id) {
		throw new AppError('#ERR_SHOP_ALREADY_CONNECTED', 409, {
			detail: `Shop ${input.shop} is already connected to another account. Please disconnect the existing connection first before connecting to a new account.`
		});
	}

	// 4. Create/update shop account
	await tx
		.insert(shopAccountTable)
		.values({
			userId: user.id,
			accountType: 'oauth',
			provider: 'shopify',
			providerAccountId: input.shop,
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
			} as TShopifyProviderData,
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.onConflictDoUpdate({
			target: [shopAccountTable.provider, shopAccountTable.providerAccountId],
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
}
