export type TMapper<T> = (key: string, value: any) => T;

export const toString =
	(): TMapper<string> =>
	(_, value): string =>
		String(value);

export const toNumber =
	(): TMapper<number> =>
	(_, value): number =>
		typeof value === 'number' ? value : parseFloat(String(value));

export const trim =
	(): TMapper<string> =>
	(_, value): string =>
		String(value).trim();

export const mapFont =
	(): TMapper<{ family: string; weight: number; style: string }> =>
	(_, value): { family: string; weight: number; style: string } => {
		const fontId = String(value);

		// Handle Shopify's font naming convention: {fontname}_{style}{weight}
		// Style patterns: n (normal), i (italic)
		// Weight patterns: 4 (400), 7 (700), etc.
		const match = fontId.match(/^(.+)_([ni])(\d+)$/);
		if (match) {
			const [, fontName, styleType, weightValue] = match;
			if (fontName != null && styleType != null && weightValue != null) {
				const family = fontName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
				const weight = parseInt(weightValue) * 100; // Convert 4 -> 400, 7 -> 700
				const style = styleType === 'n' ? 'normal' : 'italic';
				return { family, weight, style };
			}
		}

		// Fallback: just clean up the font name
		const family = fontId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
		return { family, weight: 400, style: 'normal' };
	};

export const extractUsername =
	(): TMapper<string | undefined> =>
	(_, value): string | undefined => {
		try {
			const urlObj = new URL(value);
			return urlObj.pathname.split('/').filter(Boolean).pop();
		} catch {
			const match = value.match(/(?:\.com|\.org|\.net)\/([^\/\?]+)/);
			return match?.[1];
		}
	};
