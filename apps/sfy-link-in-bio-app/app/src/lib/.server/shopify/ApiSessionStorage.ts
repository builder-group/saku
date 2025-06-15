import { type coreApiV1 } from '@repo/types/api';
import { Session } from '@shopify/shopify-api';
import { type SessionStorage } from '@shopify/shopify-app-session-storage';
import { coreApiClient } from '@/environment';
import { apiConfig } from '@/environment/.server';

// Based on: https://github.com/Shopify/shopify-app-js/blob/main/packages/apps/session-storage/shopify-app-session-storage-prisma/src/prisma.ts
export class ApiSessionStorage implements SessionStorage {
	public async storeSession(session: Session): Promise<boolean> {
		const sessionDto = this.sessionToSessionDto(session);
		const result = await coreApiClient.post('/v1/auth/shopify/session', sessionDto, {
			headers: {
				authorization: `Bearer ${apiConfig.core.secret}`
			}
		});
		return result.isOk();
	}

	public async loadSession(id: string): Promise<Session | undefined> {
		const result = await coreApiClient.get('/v1/auth/shopify/session/{sessionId}', {
			pathParams: { sessionId: id },
			headers: {
				authorization: `Bearer ${apiConfig.core.secret}`
			}
		});

		if (result.isOk()) {
			return this.sessionDtoToSession(result.value.data);
		}

		return undefined;
	}

	public async deleteSession(id: string): Promise<boolean> {
		const result = await coreApiClient.del('/v1/auth/shopify/session/{sessionId}', {
			pathParams: { sessionId: id },
			headers: {
				authorization: `Bearer ${apiConfig.core.secret}`
			}
		});

		return result.isOk();
	}

	public async deleteSessions(ids: string[]): Promise<boolean> {
		const deletePromises = ids.map((id) => this.deleteSession(id));
		const results = await Promise.all(deletePromises);
		return results.every((result) => result);
	}

	public async findSessionsByShop(shop: string): Promise<Session[]> {
		const result = await coreApiClient.get('/v1/auth/shopify/session/shop/{shopId}', {
			pathParams: { shopId: shop },
			headers: {
				authorization: `Bearer ${apiConfig.core.secret}`
			}
		});

		if (result.isOk()) {
			return result.value.data.map((sessionDto) => this.sessionDtoToSession(sessionDto));
		}

		return [];
	}

	private sessionToSessionDto(
		session: Session
	): coreApiV1.components['schemas']['ShopifySessionDto'] {
		return {
			id: session.id,
			shop: session.shop,
			state: session.state ?? '',
			isOnline: session.isOnline,
			scope: session.scope ?? '',
			expires: session.expires != null ? session.expires.toISOString() : null,
			accessToken: session.accessToken ?? '',
			onlineAccessInfo:
				session.onlineAccessInfo != null
					? {
							associated_user: {
								id: session.onlineAccessInfo.associated_user.id,
								first_name: session.onlineAccessInfo.associated_user.first_name,
								last_name: session.onlineAccessInfo.associated_user.last_name,
								email: session.onlineAccessInfo.associated_user.email,
								account_owner: session.onlineAccessInfo.associated_user.account_owner,
								locale: session.onlineAccessInfo.associated_user.locale,
								collaborator: session.onlineAccessInfo.associated_user.collaborator,
								email_verified: session.onlineAccessInfo.associated_user.email_verified
							}
						}
					: null
		};
	}

	// https://github.com/Shopify/shopify-app-js/blob/main/packages/apps/shopify-api/lib/session/session.ts
	private sessionDtoToSession(
		sessionDto: coreApiV1.components['schemas']['ShopifySessionDto']
	): Session {
		const sessionParams: [string, string | number | boolean][] = [
			['id', sessionDto.id],
			['shop', sessionDto.shop],
			['state', sessionDto.state],
			['isOnline', sessionDto.isOnline]
		];

		if (sessionDto.scope != null) {
			sessionParams.push(['scope', sessionDto.scope]);
		}

		if (sessionDto.accessToken != null) {
			sessionParams.push(['accessToken', sessionDto.accessToken]);
		}

		if (sessionDto.expires != null) {
			// Convert ISO string to timestamp (milliseconds)
			sessionParams.push(['expires', new Date(sessionDto.expires).getTime()]);
		}

		// Add online access info as individual properties if present
		if (sessionDto.onlineAccessInfo?.associated_user != null) {
			const user = sessionDto.onlineAccessInfo.associated_user;
			sessionParams.push(
				['userId', user.id],
				['firstName', user.first_name],
				['lastName', user.last_name],
				['email', user.email],
				['locale', user.locale],
				['accountOwner', user.account_owner],
				['collaborator', user.collaborator],
				['emailVerified', user.email_verified]
			);
		}

		return Session.fromPropertyArray(sessionParams, true);
	}
}
