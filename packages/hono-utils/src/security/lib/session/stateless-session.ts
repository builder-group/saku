import { Context } from 'hono';
import * as jose from 'jose';
import { createStatefulToken, TStatefulToken, TStatefulTokenConfig } from './stateful-token';
import {
	createStatelessToken,
	TStatelessToken,
	TStatelessTokenConfig,
	TValidateStatelessTokenOptions
} from './stateless-token';
import { TSession, TValidateSessionOptions } from './types';

export async function createStatelessSession<
	GData extends Record<string, any>,
	GPayload extends (GData & jose.JWTPayload) | null = (GData & jose.JWTPayload) | null
>(
	context: Context,
	config: TStatelessSessionConfig<GData>
): Promise<TStatelessSession<GData, GPayload>> {
	return {
		accessToken: await createStatelessToken<GData, GPayload>(context, config.accessToken),
		refreshToken: config.refreshToken
			? createStatefulToken<GData>(context, config.refreshToken)
			: null,

		async getSessionData(this: TStatelessSession<GData, GPayload>) {
			return this.accessToken.getTokenData();
		},
		async createSession(this: TStatelessSession<GData, GPayload>, data: GData) {
			if (this.refreshToken != null) {
				const refreshToken = await this.refreshToken?.createToken(data);
				if (refreshToken == null) {
					return false;
				}
			}

			const accessToken = await this.accessToken.createToken(data);
			if (accessToken == null) {
				return false;
			}

			return true;
		},
		async validateSession(this: TStatelessSession<GData, GPayload>, options = {}) {
			const { refreshSession = true, refreshThreshold } = options;

			// Validate access token
			if (
				await this.accessToken.validateToken(this.accessToken.token ?? undefined, {
					refreshThreshold: refreshSession ? refreshThreshold : undefined
				})
			) {
				return true;
			}

			// Refresh session with refresh token
			if (refreshSession) {
				return this.refreshSession();
			}

			return false;
		},
		async invalidateSession(this: TStatelessSession<GData, GPayload>) {
			await this.refreshToken?.invalidateToken();
			this.accessToken.invalidateToken();
		},
		async refreshSession(this: TStatelessSession<GData, GPayload>) {
			if (this.refreshToken == null) {
				return false;
			}

			if (!(await this.refreshToken.validateToken())) {
				await this.invalidateSession();
				return false;
			}

			const data = await this.refreshToken.getTokenData();
			if (data == null) {
				return false;
			}

			const accessToken = await this.accessToken.createToken(data);
			if (accessToken == null) {
				return false;
			}

			return true;
		}
	};
}

export interface TStatelessSession<
	GData extends Record<string, any>,
	GPayload extends (GData & jose.JWTPayload) | null = (GData & jose.JWTPayload) | null
> extends TSession<GData> {
	accessToken: TStatelessToken<GData, GPayload>;
	refreshToken: TStatefulToken<GData> | null;

	validateSession: (options?: TValidateStatelessSessionOptions) => Promise<boolean>;
	refreshSession: () => Promise<boolean>;
}

export interface TStatelessSessionConfig<GData extends Record<string, any>> {
	// Stateless access token
	accessToken: TStatelessTokenConfig;

	// Stateful refresh token
	refreshToken?: TStatefulTokenConfig<GData>;
}

export interface TValidateStatelessSessionOptions
	extends TValidateStatelessTokenOptions,
		TValidateSessionOptions {}
