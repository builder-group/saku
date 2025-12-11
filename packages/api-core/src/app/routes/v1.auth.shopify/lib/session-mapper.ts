import type { TCachedShopifySession } from '@/lib/redis';
import type { TShopifySessionDto } from '../schema';

export function mapDtoToCached(dto: TShopifySessionDto): TCachedShopifySession {
	return {
		id: dto.id,
		shop: dto.shop,
		state: dto.state,
		isOnline: dto.isOnline,
		scope: dto.scope,
		expires: dto.expires,
		accessToken: dto.accessToken,
		mantleApiToken: dto.mantleApiToken,
		onlineAccessInfo:
			dto.onlineAccessInfo != null
				? {
						associatedUser: {
							id: dto.onlineAccessInfo.associated_user.id,
							firstName: dto.onlineAccessInfo.associated_user.first_name,
							lastName: dto.onlineAccessInfo.associated_user.last_name,
							email: dto.onlineAccessInfo.associated_user.email,
							accountOwner: dto.onlineAccessInfo.associated_user.account_owner,
							locale: dto.onlineAccessInfo.associated_user.locale,
							collaborator: dto.onlineAccessInfo.associated_user.collaborator,
							emailVerified: dto.onlineAccessInfo.associated_user.email_verified
						},
						expiresIn: dto.onlineAccessInfo.expires_in,
						associatedUserScope: dto.onlineAccessInfo.associated_user_scope,
						session: dto.onlineAccessInfo.session,
						accountNumber: dto.onlineAccessInfo.account_number
					}
				: null
	};
}

export function mapCachedToDto(cached: TCachedShopifySession): TShopifySessionDto {
	return {
		id: cached.id,
		shop: cached.shop,
		state: cached.state,
		isOnline: cached.isOnline,
		scope: cached.scope,
		expires: cached.expires,
		accessToken: cached.accessToken,
		mantleApiToken: cached.mantleApiToken,
		onlineAccessInfo:
			cached.onlineAccessInfo != null
				? {
						associated_user: {
							id: cached.onlineAccessInfo.associatedUser.id,
							first_name: cached.onlineAccessInfo.associatedUser.firstName,
							last_name: cached.onlineAccessInfo.associatedUser.lastName,
							email: cached.onlineAccessInfo.associatedUser.email,
							account_owner: cached.onlineAccessInfo.associatedUser.accountOwner,
							locale: cached.onlineAccessInfo.associatedUser.locale,
							collaborator: cached.onlineAccessInfo.associatedUser.collaborator,
							email_verified: cached.onlineAccessInfo.associatedUser.emailVerified
						},
						expires_in: cached.onlineAccessInfo.expiresIn,
						associated_user_scope: cached.onlineAccessInfo.associatedUserScope,
						session: cached.onlineAccessInfo.session,
						account_number: cached.onlineAccessInfo.accountNumber
					}
				: null
	};
}
