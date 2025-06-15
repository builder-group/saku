import type { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { CookieOptions } from 'hono/utils/cookie';

export function createStatefulToken<GData extends Record<string, any>>(
	context: Context,
	config: TStatefulTokenConfig<GData>
): TStatefulToken<GData> {
	return {
		_honoContext: context,
		_config: config,
		token: getCookie(context, config.cookieName) ?? null,
		data: null,

		async getTokenData(this: TStatefulToken<GData>, cached = true) {
			if (this.token == null) {
				return null;
			}

			if (!cached || this.data == null) {
				const data = await this._config.getTokenData?.(this.token);
				if (data != null) {
					this.data = data;
				}
			}

			return this.data;
		},
		async createToken(this: TStatefulToken<GData>, data) {
			const createTokenResult = await this._config.createToken(data);
			if (createTokenResult == null) {
				return null;
			}
			const { token, expiresAt, data: updatedData } = createTokenResult;

			this.data = updatedData ?? data;
			this.token = token;
			this._setTokenCookie(token, {
				expires: expiresAt
			});
			return token;
		},
		async validateToken(
			this: TStatefulToken<GData>,
			token = this.token ?? undefined,
			options = {}
		) {
			if (token == null) {
				return false;
			}

			const { refreshToken = true } = options;

			const validateTokenResult = await this._config.validateToken(token, { refreshToken });
			if (typeof validateTokenResult === 'boolean') {
				return validateTokenResult;
			}

			// Rotate token if new token is provided
			if (validateTokenResult.token != null) {
				this.token = validateTokenResult.token;
				this._setTokenCookie(validateTokenResult.token, {
					expires: validateTokenResult.expiresAt
				});
			}
			// Extend token expiration if expiration is provided but no new token
			else if (validateTokenResult.expiresAt != null && this.token != null) {
				this._setTokenCookie(this.token, {
					expires: validateTokenResult.expiresAt
				});
			}

			// Update data if provided
			if (validateTokenResult.data != null) {
				this.data = validateTokenResult.data;
			}

			return true;
		},
		async invalidateToken(this: TStatefulToken<GData>) {
			if (this.token != null) {
				await this._config.invalidateToken(this.token);
			}
			this.token = null;
			this._setTokenCookie('', { maxAge: 0 });
		},

		_setTokenCookie(this: TStatefulToken<GData>, token: string, options = {}) {
			setCookie(this._honoContext, this._config.cookieName, token, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				...options,
				...this._config.cookieOptions
			});
		}
	};
}
export interface TStatefulToken<GData extends Record<string, any>> {
	_honoContext: Context;
	_config: TStatefulTokenConfig<GData>;
	token: string | null;
	data: GData | null;
	getTokenData: (cached?: boolean) => Promise<GData | null>;
	createToken: (data: GData) => Promise<string | null>;
	validateToken: (token?: string, options?: TValidateStatefulTokenOptions) => Promise<boolean>;
	invalidateToken: () => Promise<void>;
	_setTokenCookie: (token: string, options?: CookieOptions) => void;
}

export interface TStatefulTokenConfig<GData extends Record<string, any>> {
	validateToken: (
		token: string,
		options?: TValidateStatefulTokenOptions
	) => Promise<{ token?: string; expiresAt?: Date; data?: GData } | boolean>;
	createToken: (data: GData) => Promise<{ token: string; expiresAt?: Date; data?: GData } | null>;
	invalidateToken: (token: string) => Promise<void>;
	getTokenData?: (token: string) => Promise<GData | null>;
	cookieName: string;
	cookieOptions?: CookieOptions;
}

export interface TValidateStatefulTokenOptions {
	refreshToken?: boolean;
}
