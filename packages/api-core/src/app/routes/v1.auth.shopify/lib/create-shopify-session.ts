import { AppError } from '@repo/hono-utils';
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
			await createUserAndShopAccount(tx, input);
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

async function createUserAndShopAccount(
	tx: TPgTransaction,
	input: TShopifySessionDto
): Promise<boolean> {
	const associatedUser = input.onlineAccessInfo?.associated_user;
	if (associatedUser == null) {
		return false;
	}

	// 1. Create or find user by email
	const [user] = await tx
		.insert(userTable)
		.values({
			handle: createHandleFromEmail(associatedUser.email),
			displayName: `${associatedUser.first_name} ${associatedUser.last_name}`,
			email: associatedUser.email,
			emailVerifiedAt: associatedUser.email_verified ? new Date() : null,
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.onConflictDoUpdate({
			target: userTable.email,
			set: {
				// Don't update displayName - user might have customized it in our app
				// displayName: `${associatedUser.first_name} ${associatedUser.last_name}`,
				// Do update emailVerifiedAt - we trust Shopify's verification status
				emailVerifiedAt: associatedUser.email_verified ? new Date() : null,
				updatedAt: new Date()
			}
		})
		.returning({
			id: userTable.id
		});
	if (user == null) {
		throw new AppError('#ERR_USER_CREATE_FAILED', 500, {
			detail: 'Failed to create or find user'
		});
	}

	// 2. Create OTP user account for future login (only if it doesn't exist)
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

	// 3. Create shop account with installer data
	await tx
		.insert(shopAccountTable)
		.values({
			userId: user.id,
			accountType: 'oauth',
			provider: 'shopify',
			providerAccountId: input.shop,
			providerData: {
				lastInstaller: {
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
				// Update userId to current installer - shop "ownership" can change
				// TODO: Maybe support connecting a shop to multiple users/workspaces later?
				userId: user.id,
				accountType: 'oauth',
				providerData: {
					lastInstaller: {
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

	return true;
}
