import { AppError } from '@repo/hono-utils';
import { and, eq } from 'drizzle-orm';
import {
	db,
	mantleClient,
	shopifySessionTable,
	TEmailOTPUserAccountData,
	TTransaction as TPgTransaction,
	TShopifySessionData,
	TWorkspaceAccountData,
	TWorkspaceRole,
	userAccountTable,
	userTable,
	workspaceAccountTable,
	workspaceMemberTable,
	workspaceTable
} from '@/environment';
import { createDisplayNameFromShop, createHandleFromShop } from '@/lib';
import { getShopInfo } from '@/lib/gql/shopify-admin/queries';
import type { TShopifySessionDto } from '../schema';
import { createHandleFromEmail } from './create-handle-from-email';

export async function createShopifySession(session: TShopifySessionDto): Promise<void> {
	await db.transaction(async (tx) => {
		// 1. Store session data (works for both online and offline)
		await upsertSession(tx, session);

		// 2. Create user, workspace, and workspace account if online session
		if (session.isOnline) {
			await upsertUserAndWorkspace(tx, session);
		}

		return session;
	});
}

async function upsertSession(tx: TPgTransaction, session: TShopifySessionDto): Promise<void> {
	const sessionData: TShopifySessionData = {};

	if (session.isOnline) {
		// Store online access info of Shopify user
		if (session.onlineAccessInfo != null) {
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

		// Create Mantle API key for online sessions only
		// because Mantle identifies shops based on user context - offline sessions have no user association
		const shopInfo = await getShopInfo({
			shopId: session.shop,
			accessToken: session.accessToken
		});
		if (shopInfo.isOk()) {
			const identifyResponse = await mantleClient.identify({
				platform: 'shopify',
				platformId: shopInfo.value.id,
				myshopifyDomain: session.shop,
				accessToken: session.accessToken
			});
			if ('apiToken' in identifyResponse) {
				sessionData.mantleApiToken = identifyResponse.apiToken;
			}
		}
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

async function upsertUserAndWorkspace(
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
				provider: 'email',
				providerAccountId: associatedUser.email,
				accountType: 'otp',
				accountData: {} satisfies TEmailOTPUserAccountData,
				updatedAt: new Date(),
				createdAt: new Date()
			})
			.onConflictDoNothing();
	}

	const shopHandle = createHandleFromShop(session.shop);

	// 3. Find or create workspace for this Shopify store
	// Note: Currently, workspace = single Shopify store (1:1 relationship)
	// While the schema supports multiple stores per workspace (future SaaS),
	// we currently enforce 1 store = 1 workspace for simplicity.
	// This is enforced by setting the workspace handle to the shop handle.
	let [workspace] = await tx
		.select({
			id: workspaceTable.id
		})
		.from(workspaceTable)
		.where(eq(workspaceTable.handle, shopHandle))
		.limit(1);

	// Create workspace for this Shopify store
	if (workspace == null) {
		[workspace] = await tx
			.insert(workspaceTable)
			.values({
				handle: shopHandle,
				displayName: createDisplayNameFromShop(session.shop),
				updatedAt: new Date(),
				createdAt: new Date()
			})
			.returning({
				id: workspaceTable.id
			});
		if (workspace == null) {
			throw new AppError('#ERR_WORKSPACE_CREATE_FAILED', 500, {
				detail: 'Failed to create workspace'
			});
		}
	}

	// 4. Add user to workspace with appropriate role
	const isAccountOwner = associatedUser.account_owner;
	const isCollaborator = associatedUser.collaborator;

	let workspaceRole: TWorkspaceRole;
	if (isAccountOwner) {
		workspaceRole = 'owner';
	} else if (isCollaborator) {
		workspaceRole = 'member'; // Collaborators get limited access
	} else {
		workspaceRole = 'admin'; // Staff members get admin access
	}

	// Check if user is already a member of this workspace
	const [existingMember] = await tx
		.select({
			role: workspaceMemberTable.role
		})
		.from(workspaceMemberTable)
		.where(
			and(
				eq(workspaceMemberTable.workspaceId, workspace.id),
				eq(workspaceMemberTable.userId, user.id)
			)
		)
		.limit(1);

	// User is already a member - update role if they're now the account owner
	// (handles case where staff member becomes owner, or owner status changes)
	if (existingMember) {
		if (isAccountOwner && existingMember.role !== 'owner') {
			await tx
				.update(workspaceMemberTable)
				.set({
					role: 'owner',
					updatedAt: new Date()
				})
				.where(
					and(
						eq(workspaceMemberTable.workspaceId, workspace.id),
						eq(workspaceMemberTable.userId, user.id)
					)
				);
		}
	}
	// Add new user to workspace
	else {
		await tx.insert(workspaceMemberTable).values({
			workspaceId: workspace.id,
			userId: user.id,
			role: workspaceRole,
			updatedAt: new Date(),
			createdAt: new Date()
		});
	}

	// 5. Create workspace account (Shopify connection) - preserve original installer
	await tx
		.insert(workspaceAccountTable)
		.values({
			workspaceId: workspace.id,
			provider: 'shopify',
			providerAccountId: session.shop,
			accountType: 'oauth',
			accountData: {
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
			} satisfies TWorkspaceAccountData,
			updatedAt: new Date(),
			createdAt: new Date()
		})
		.onConflictDoNothing(); // Don't overwrite existing installer data
}
