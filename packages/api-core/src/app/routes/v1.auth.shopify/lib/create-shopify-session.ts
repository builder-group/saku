import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import {
	db,
	shopAccountTable,
	TEmailOTPProviderData,
	TShopifyProviderData,
	userAccountTable,
	userTable
} from '@/environment';
import type { TCreateShopifySessionDto, TShopifySessionDto } from '../schema';
import { createHandleFromEmail } from './create-handle-from-email';

export async function createShopifySession(
	input: TCreateShopifySessionDto
): Promise<TShopifySessionDto> {
	// Validate that we have online access info for user creation
	// because we link the shop account to a user
	if (input.onlineAccessInfo?.associated_user == null) {
		throw new AppError('#ERR_MISSING_USER_INFO', 400, {
			detail: 'Online access info with associated user is required for session creation'
		});
	}

	const associatedUser = input.onlineAccessInfo.associated_user;
	const sessionId = input.id ?? `${input.shop}_${associatedUser.id}`;

	const result = await db.transaction(async (tx) => {
		// 1. Create or find user by email
		let user;
		const existingUser = await tx
			.select({
				id: userTable.id,
				handle: userTable.handle,
				email: userTable.email
			})
			.from(userTable)
			.where(eq(userTable.email, associatedUser.email))
			.limit(1);

		// Create new user
		if (!existingUser.length) {
			const [newUser] = await tx
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
					id: userTable.id,
					handle: userTable.handle,
					email: userTable.email
				});
			user = newUser;
		}
		// Get existing user
		else {
			user = existingUser[0];
		}

		// Ensure user is defined
		if (user == null) {
			throw new AppError('#ERR_USER_CREATE_FAILED', 500, {
				detail: 'Failed to create or find user'
			});
		}

		// 2. Create OTP user account for future login
		const existingOtpAccount = await tx
			.select()
			.from(userAccountTable)
			.where(
				and(
					eq(userAccountTable.provider, 'email'),
					eq(userAccountTable.providerAccountId, associatedUser.email)
				)
			)
			.limit(1);

		// Create new OTP user account
		if (!existingOtpAccount.length) {
			await tx.insert(userAccountTable).values({
				userId: user.id,
				accountType: 'otp',
				provider: 'email',
				providerAccountId: associatedUser.email,
				providerData: {} satisfies TEmailOTPProviderData,
				updatedAt: new Date(),
				createdAt: new Date()
			});
		}

		// 3. Create shop account
		const shopProviderData: TShopifyProviderData = {
			sessionId,
			accessToken: input.accessToken,
			expiresAt: input.expires,
			scopes: input.scope,
			state: input.state,
			isOnline: input.isOnline,
			installer: {
				shopifyId: associatedUser.id.toString(),
				email: associatedUser.email,
				firstName: associatedUser.first_name,
				lastName: associatedUser.last_name,
				isOwner: associatedUser.account_owner,
				emailVerified: associatedUser.email_verified,
				locale: associatedUser.locale,
				isCollaborator: associatedUser.collaborator
			}
		};

		// Check if shop account already exists
		const existingShopAccount = await tx
			.select()
			.from(shopAccountTable)
			.where(
				and(
					eq(shopAccountTable.provider, 'shopify'),
					eq(shopAccountTable.providerAccountId, input.shop)
				)
			)
			.limit(1);

		// Create new shop account
		if (!existingShopAccount.length) {
			await tx.insert(shopAccountTable).values({
				userId: user.id,
				accountType: 'oauth',
				provider: 'shopify',
				providerAccountId: input.shop,
				providerData: shopProviderData,
				updatedAt: new Date(),
				createdAt: new Date()
			});
		}
		// Update existing shop account with new session data
		else {
			await tx
				.update(shopAccountTable)
				.set({
					providerData: shopProviderData,
					updatedAt: new Date()
				})
				.where(
					and(
						eq(shopAccountTable.provider, 'shopify'),
						eq(shopAccountTable.providerAccountId, input.shop)
					)
				);
		}

		return {
			id: sessionId,
			...input
		};
	});

	return result;
}
