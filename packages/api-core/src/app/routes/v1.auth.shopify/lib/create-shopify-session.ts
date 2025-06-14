import { AppError } from '@repo/hono-utils';
import { and, eq, sql } from 'drizzle-orm';
import {
	db,
	logger,
	shopAccountTable,
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

	logger.info(`Creating shopify session: ${sessionId}`);

	const result = await db.transaction(async (tx) => {
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

		// No account exists - create user and shop account
		if (!existingShopAccount.length) {
			await createUserAndShopAccount(tx, input, sessionId);
		}
		// Account exists - just update session
		else {
			await updateSession(tx, input, sessionId);
		}

		return {
			id: sessionId,
			...input
		};
	});

	return result;
}

async function createUserAndShopAccount(
	tx: TPgTransaction,
	input: TCreateShopifySessionDto,
	sessionId: string
) {
	const associatedUser = input.onlineAccessInfo?.associated_user;
	if (associatedUser == null) {
		throw new AppError('#ERR_MISSING_ASSOCIATED_USER', 400, {
			detail: 'Associated user is required to create new shop account'
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

	// 2. Create OTP user account for future login
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

	// 3. Create shop account with session data
	const { sessionData, sessionProperty } = getSessionData(input, sessionId);

	await tx.insert(shopAccountTable).values({
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
			},
			[sessionProperty]: sessionData
		} as TShopifyProviderData,
		updatedAt: new Date(),
		createdAt: new Date()
	});
}

async function updateSession(
	tx: TPgTransaction,
	input: TCreateShopifySessionDto,
	sessionId: string
) {
	const { sessionData, sessionProperty } = getSessionData(input, sessionId);

	// Update existing shop account
	await tx
		.update(shopAccountTable)
		.set({
			providerData: sql`jsonb_set(provider_data, '{${sql.raw(sessionProperty)}}', ${JSON.stringify(sessionData)}::jsonb)`,
			updatedAt: new Date()
		})
		.where(
			and(
				eq(shopAccountTable.provider, 'shopify'),
				eq(shopAccountTable.providerAccountId, input.shop)
			)
		);
}

function getSessionData(input: TCreateShopifySessionDto, sessionId: string) {
	const sessionData = input.isOnline
		? {
				sessionId,
				accessToken: input.accessToken,
				scopes: input.scope,
				state: input.state,
				expiresAt: input.expires
			}
		: {
				sessionId,
				accessToken: input.accessToken,
				scopes: input.scope,
				state: input.state
			};

	const sessionProperty = input.isOnline ? 'onlineSession' : 'offlineSession';

	return { sessionData, sessionProperty };
}
