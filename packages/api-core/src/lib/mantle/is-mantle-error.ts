export function isMantleError(error: unknown): error is { error: string } {
	return typeof error === 'object' && error != null && 'error' in error;
}
