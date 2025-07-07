export function extractXUsername(url: string): string | null {
	try {
		const urlObj = new URL(url);
		const pathParts = urlObj.pathname.split('/').filter(Boolean);
		return pathParts[0] ?? null;
	} catch {
		return null;
	}
}
