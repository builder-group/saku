import { withNewAsync } from '@blgc/utils';
import type { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { CookieOptions } from 'hono/utils/cookie';
import * as jose from 'jose';

export function createStatelessToken<
	GData extends Record<string, any>,
	GPayload extends (GData & jose.JWTPayload) | null = (GData & jose.JWTPayload) | null
>(context: Context, config: TStatelessTokenConfig): Promise<TStatelessToken<GData, GPayload>> {
	return withNewAsync<TStatelessToken<GData, GPayload>>({
		_honoContext: context,
		_config: config,
		token: getCookie(context, config.cookieName) ?? null,
		payload: null as GPayload,

		async _new(this: TStatelessToken<GData, GPayload>) {
			this.payload = (await this._verifyToken()) as GPayload;
		},

		isValid(
			this: TStatelessToken<GData, GPayload>
		): this is TStatelessToken<GData, NonNullable<GPayload>> {
			if (this.payload == null) {
				return false;
			}

			// If no expiration set or not yet expired, consider valid
			const { exp } = this.payload;
			const now = Math.floor(Date.now() / 1000);
			if (exp == null || now < exp) {
				return true;
			}

			return false;
		},
		getTokenData(this: TStatelessToken<GData, GPayload>) {
			if (this.payload == null) {
				return null;
			}

			const { iss, sub, aud, jti, nbf, exp, iat, ...customData } = this.payload;

			return customData as GData;
		},
		async createToken(this: TStatelessToken<GData, GPayload>, data) {
			const { secret, issuer, expirationTime } = this._config;

			const token = await new jose.SignJWT(data)
				.setProtectedHeader({ alg: 'HS256' })
				.setExpirationTime(expirationTime)
				.setIssuedAt()
				.setIssuer(issuer)
				.sign(new TextEncoder().encode(secret));

			this.payload = (await this._verifyToken(token)) as GPayload;
			if (this.payload == null || this.payload.exp == null) {
				return null;
			}

			this.token = token;
			this._setTokenCookie(token, {
				expires: new Date(this.payload.exp * 1000)
			});
			return token;
		},
		async validateToken(
			this: TStatelessToken<GData, GPayload>,
			token = this.token ?? undefined,
			options = {}
		) {
			if (token == null || !this.isValid()) {
				return false;
			}

			// Refresh token if token is nearing expiration
			const { refreshThreshold } = options;
			if (refreshThreshold != null) {
				const now = Math.floor(Date.now() / 1000);
				const exp = this.payload.exp;
				const iat = this.payload.iat;

				// If session is expired or nearing expiration, try to refresh it
				if (exp != null && iat != null) {
					const totalLifetime = exp - iat;
					const remainingLifetime = exp - now;
					const remainingPercentage = remainingLifetime / totalLifetime;
					if (remainingPercentage <= refreshThreshold && remainingPercentage > 0) {
						await this.createToken(this.getTokenData() as GData);
					}
				}
			}

			return true;
		},
		async invalidateToken(this: TStatelessToken<GData, GPayload>) {
			this.token = null;
			this.payload = null as GPayload;
			this._setTokenCookie('', { maxAge: 0 });
		},

		async _verifyToken(this: TStatelessToken<GData, GPayload>, token = this.token ?? undefined) {
			if (token == null) {
				return null;
			}

			const { secret, issuer } = this._config;

			try {
				const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(secret), {
					issuer
				});
				return payload as GPayload;
			} catch {
				return null;
			}
		},
		_setTokenCookie(this: TStatelessToken<GData, GPayload>, token: string, options = {}) {
			setCookie(this._honoContext, this._config.cookieName, token, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				...options,
				...this._config.cookieOptions
			});
		}
	});
}

export interface TStatelessToken<
	GData extends Record<string, any>,
	GPayload extends (GData & jose.JWTPayload) | null = (GData & jose.JWTPayload) | null
> {
	_honoContext: Context;
	_config: TStatelessTokenConfig;
	token: string | null;
	payload: GPayload;
	isValid: () => this is TStatelessToken<GData, NonNullable<GPayload>>;
	getTokenData: () => GData | null;
	createToken: (data?: GData) => Promise<string | null>;
	validateToken: (token?: string, options?: TValidateStatelessTokenOptions) => Promise<boolean>;
	invalidateToken: () => void;
	_verifyToken: (token?: string) => Promise<GPayload | null>;
	_setTokenCookie: (token: string, options?: CookieOptions) => void;
}

export interface TStatelessTokenConfig {
	secret: string;
	issuer: string;
	refreshThreshold?: number;
	expirationTime: `${number}m` | `${number}h` | `${number}d`;
	cookieName: string;
	cookieOptions?: CookieOptions;
}

export interface TValidateStatelessTokenOptions {
	/**
	 * The threshold (0-1) of remaining session lifetime before refreshing.
	 * Default is `0.5` (50%).
	 */
	refreshThreshold?: number;
}
