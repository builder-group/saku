import { AppError } from '@repo/hono-utils';
import {
	db,
	shopAccountTable,
	shopifySessionTable,
	TEmailOTPProviderData,
	TTransaction as TPgTransaction,
	TShopifyProviderData,
	userAccountTable,
	userTable
} from '@/environment';
import type { TCreateShopifySessionDto, TShopifySessionDto } from '../schema';
import { createHandleFromEmail } from './create-handle-from-email';

export async function createShopifySession(
	input: TCreateShopifySessionDto
): Promise<TShopifySessionDto> {
	const sessionId =
		input.id ??
		(input.isOnline
			? `${input.shop}_${input.onlineAccessInfo?.associated_user?.id}`
			: `offline_${input.shop}`);

	const result = await db.transaction(async (tx) => {
		// 1. Store session data (works for both online and offline)
		await upsertSession(tx, input, sessionId);

		// 2. Create shop account + user if online session
		if (input.isOnline) {
			await createUserAndShopAccount(tx, input);
		}

		return {
			id: sessionId,
			...input
		};
	});

	return result;
}

async function upsertSession(
	tx: TPgTransaction,
	input: TCreateShopifySessionDto,
	sessionId: string
): Promise<void> {
	await tx
		.insert(shopifySessionTable)
		.values({
			sessionId,
			shopId: input.shop,
			isOnline: input.isOnline,
			accessToken: input.accessToken,
			scopes: input.scope,
			state: input.state,
			expiresAt: input.expires != null ? new Date(input.expires) : null,
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.onConflictDoUpdate({
			target: shopifySessionTable.sessionId,
			set: {
				accessToken: input.accessToken,
				scopes: input.scope,
				state: input.state,
				expiresAt: input.expires != null ? new Date(input.expires) : null,
				updatedAt: new Date()
			}
		});
}

async function createUserAndShopAccount(
	tx: TPgTransaction,
	input: TCreateShopifySessionDto
): Promise<void> {
	const associatedUser = input.onlineAccessInfo?.associated_user;
	if (associatedUser == null) {
		throw new AppError('#ERR_USER_CREATE_FAILED', 500, {
			detail: 'Failed to create or find user'
		});
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
				displayName: `${associatedUser.first_name} ${associatedUser.last_name}`,
				emailVerifiedAt: associatedUser.email_verified ? new Date() : null,
				updatedAt: new Date()
			}
		})
		.returning({
			id: userTable.id,
			handle: userTable.handle,
			email: userTable.email
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

	// 3. Create shop account with installer data (only if it doesn't exist)
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
		.onConflictDoNothing();
}
