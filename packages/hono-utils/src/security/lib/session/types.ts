export interface TSession<GData extends Record<string, any>> {
	getSessionData: () => Promise<GData | null>;
	createSession: (data: GData) => Promise<boolean>;
	validateSession: (options?: TValidateSessionOptions) => Promise<boolean>;
	invalidateSession: () => Promise<void>;
}

export interface TValidateSessionOptions {
	/**
	 * Whether to refresh the session (e.g. if it's near expiration).
	 *
	 * In React Server Components, this should be disabled since cookies can't be updated,
	 * which will cause inconsistencies between server and client.
	 *
	 * Defaults to `true`.
	 */
	refreshSession?: boolean;
}
