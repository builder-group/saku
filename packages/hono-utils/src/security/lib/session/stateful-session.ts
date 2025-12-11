import { Context } from 'hono';
import { createStatefulToken, TStatefulToken, TStatefulTokenConfig } from './stateful-token';
import { TSession } from './types';

export async function createStatefulSession<GData extends Record<string, any>>(
	context: Context,
	config: TStatefulSessionConfig<GData>
): Promise<TStatefulSession<GData>> {
	return {
		token: createStatefulToken<GData>(context, config),

		async getSessionData(this: TStatefulSession<GData>) {
			return this.token.getTokenData();
		},
		async createSession(this: TStatefulSession<GData>, data: GData) {
			const token = await this.token.createToken(data);
			if (token == null) {
				return false;
			}

			return true;
		},
		async validateSession(this: TStatefulSession<GData>, options = {}) {
			const { refreshSession = true } = options;

			if (!(await this.token.validateToken(undefined, { refreshToken: refreshSession }))) {
				await this.invalidateSession();
				return false;
			}

			return true;
		},
		async invalidateSession(this: TStatefulSession<GData>) {
			await this.token.invalidateToken();
		}
	};
}

export interface TStatefulSession<GData extends Record<string, any>> extends TSession<GData> {
	token: TStatefulToken<GData>;
}

export interface TStatefulSessionConfig<
	GData extends Record<string, any>
> extends TStatefulTokenConfig<GData> {}
