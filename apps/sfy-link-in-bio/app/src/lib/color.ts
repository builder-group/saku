/**
 * Validates if a string is a valid 3 or 6 digit hex color code with # prefix
 */
export function isValidHex(hex: string): boolean {
	return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex);
}

/**
 * Expands a 3-digit hex color to 6-digit format
 * Does not modify already expanded hex colors
 */
export function expandShortHex(hex: string): string {
	if (!hex.startsWith('#')) {
		return hex;
	}

	const value = hex.substring(1);
	if (value.length === 6) {
		return hex;
	}

	return `#${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`;
}

export function hexToHsba(hex: string): THSBA {
	// Remove the hash if it exists
	hex = hex.replace('#', '');

	// Parse the hex values
	const r = parseInt(hex.slice(0, 2), 16) / 255;
	const g = parseInt(hex.slice(2, 4), 16) / 255;
	const b = parseInt(hex.slice(4, 6), 16) / 255;
	const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : undefined;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const d = max - min;

	let h = 0;
	const s = max === 0 ? 0 : d / max;
	const v = max;

	if (max !== min) {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return {
		hue: h * 360,
		saturation: s,
		brightness: v,
		...(a !== undefined && { alpha: a })
	};
}

export function hsbaToHex({ hue, saturation, brightness, alpha }: THSBA): string {
	const h = hue / 360;
	const s = saturation;
	const v = brightness;

	let r: number, g: number, b: number;

	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		case 5:
			r = v;
			g = p;
			b = q;
			break;
		default:
			r = 0;
			g = 0;
			b = 0;
	}

	const toHex = (n: number) => {
		const hex = Math.round(n * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	const hex = '#' + toHex(r) + toHex(g) + toHex(b);
	return alpha !== undefined ? hex + toHex(alpha) : hex;
}

interface THSBA {
	hue: number;
	saturation: number;
	brightness: number;
	alpha?: number;
}
