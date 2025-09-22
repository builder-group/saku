export function hexToRgba(hex: string): TRgba {
	const defaultColor: TRgba = { r: 1, g: 1, b: 1, a: 1 };
	const cleanHex = hex.replace('#', '').toLowerCase();

	// Handle shorthand (#RGB or #RGBA)
	if (cleanHex.length === 3 || cleanHex.length === 4) {
		const [r, g, b, a = 'f'] = cleanHex.split('');
		if (r == null || g == null || b == null) {
			return defaultColor;
		}
		return hexToRgba(`${r}${r}${g}${g}${b}${b}${a}${a}`);
	}

	// Handle full hex (#RRGGBB or #RRGGBBAA)
	if (cleanHex.length === 6 || cleanHex.length === 8) {
		const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
		const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
		const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
		const a = cleanHex.length === 8 ? parseInt(cleanHex.slice(6, 8), 16) / 255 : 1;

		if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
			return defaultColor;
		}

		return { r, g, b, a };
	}

	return defaultColor;
}

export function rgbaToHex({ r, g, b }: TRgba): `#${string}` {
	const toHex = (n: number): string => {
		const value = Math.round(clamp(n) * 255);
		const hex = value.toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hsbaToRgba({ hue, saturation, brightness, alpha }: THsba): TRgba {
	// Normalize inputs
	const h = ((hue % 360) + 360) % 360;
	const s = clamp(saturation);
	const v = clamp(brightness);
	const a = clamp(alpha);

	// Handle grayscale case
	if (s === 0) {
		return { r: v, g: v, b: v, a };
	}

	// Convert hue to sector (0-5) and fractional part
	const sector = h / 60;
	const i = Math.floor(sector);
	const f = sector - i;

	// Calculate color components
	const p = v * (1 - s);
	const q = v * (1 - s * f);
	const t = v * (1 - s * (1 - f));

	// Map sector to RGB values
	const rgbaValues: TRgba[] = [
		{ r: v, g: t, b: p, a },
		{ r: q, g: v, b: p, a },
		{ r: p, g: v, b: t, a },
		{ r: p, g: q, b: v, a },
		{ r: t, g: p, b: v, a },
		{ r: v, g: p, b: q, a }
	];

	// @ts-expect-error -- i is always 0-5 from the math above
	return rgbaValues[i % 6];
}

export function rgbaToHsba({ r, g, b, a }: TRgba): THsba {
	const cr = clamp(r);
	const cg = clamp(g);
	const cb = clamp(b);

	const max = Math.max(cr, cg, cb);
	const min = Math.min(cr, cg, cb);
	const d = max - min;

	// Calculate hue (0-360°)
	let h = 0;
	if (d !== 0) {
		if (max === cr) {
			// Red is dominant
			h = 60 * ((cg - cb) / d);
			if (cg < cb) h += 360;
		} else if (max === cg) {
			// Green is dominant
			h = 60 * ((cb - cr) / d) + 120;
		} else {
			// Blue is dominant
			h = 60 * ((cr - cg) / d) + 240;
		}
	}

	return {
		hue: Math.round(h),
		saturation: max === 0 ? 0 : d / max,
		brightness: max,
		alpha: clamp(a)
	};
}

export function rgbaToCssRgba({ r, g, b, a }: TRgba): string {
	const rgb = [r, g, b].map((n) => Math.round(clamp(n) * 255)).join(' ');
	const alpha = clamp(a);
	return alpha === 1 ? `rgb(${rgb})` : `rgb(${rgb} / ${alpha})`;
}

export function cssRgbaToRgba(css: string | null | undefined): TRgba | undefined {
	if (css == null) {
		return undefined;
	}

	const match = css.match(/^rgba?\((.*)\)$/);
	if (match?.[1] == null) {
		return undefined;
	}

	const values = match[1]
		.split(/[\s,/]+/)
		.map(Number)
		.filter((n) => !isNaN(n));
	if (values.length < 3) {
		return undefined;
	}

	const [r = 0, g = 0, b = 0] = values;
	const a = values[3] ?? 1;

	if (r > 255 || g > 255 || b > 255) {
		return undefined;
	}

	// Support both 0-1 and 0-255 alpha formats
	const normalizedAlpha = a > 1 ? a / 255 : a;
	if (normalizedAlpha > 1) {
		return undefined;
	}

	return {
		r: clamp(r / 255),
		g: clamp(g / 255),
		b: clamp(b / 255),
		a: clamp(normalizedAlpha)
	};
}

export function cssRgbaToHex(css: string | null | undefined): `#${string}` | undefined {
	const rgba = cssRgbaToRgba(css);
	if (rgba == null) {
		return undefined;
	}
	return rgbaToHex(rgba);
}

/**
 * Validates if a string is a valid 3 or 6 digit hex color code with # prefix
 */
export function isValidHex(hex: string): boolean {
	return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex);
}

/**
 * Returns black or white based on which has better contrast with the background
 */
export function getBestContrastColor(backgroundColor: TRgba): TRgba {
	// Blend with white browser background based on alpha
	const blendedR = backgroundColor.r * backgroundColor.a + 1 * (1 - backgroundColor.a);
	const blendedG = backgroundColor.g * backgroundColor.a + 1 * (1 - backgroundColor.a);
	const blendedB = backgroundColor.b * backgroundColor.a + 1 * (1 - backgroundColor.a);

	// Calculate luminance using simple weighted average
	const luminance = blendedR * 0.299 + blendedG * 0.587 + blendedB * 0.114;

	// If background is light, use black. If dark, use white.
	return luminance > 0.5
		? { r: 0, g: 0, b: 0, a: 1 } // Black
		: { r: 1, g: 1, b: 1, a: 1 }; // White
}

export function isRgba(value: unknown): value is TRgba {
	return (
		typeof value === 'object' &&
		value != null &&
		'r' in value &&
		'g' in value &&
		'b' in value &&
		'a' in value &&
		typeof value.r === 'number' &&
		typeof value.g === 'number' &&
		typeof value.b === 'number' &&
		typeof value.a === 'number'
	);
}

function clamp(n: number, min = 0, max = 1): number {
	return Math.max(min, Math.min(max, n));
}

/**
 * RGBA (Red, Green, Blue, Alpha) color space
 * - Red: 0-1 (0% to 100% intensity)
 * - Green: 0-1 (0% to 100% intensity)
 * - Blue: 0-1 (0% to 100% intensity)
 * - Alpha: 0-1 (0% to 100% opacity)
 *
 * Example:
 * - Black: { r: 0, g: 0, b: 0, a: 1 }
 * - White: { r: 1, g: 1, b: 1, a: 1 }
 * - Red: { r: 1, g: 0, b: 0, a: 1 }
 * - Semi-transparent blue: { r: 0, g: 0, b: 1, a: 0.5 }
 */
export interface TRgba {
	/** Red component (0-1) */
	r: number;
	/** Green component (0-1) */
	g: number;
	/** Blue component (0-1) */
	b: number;
	/** Alpha/opacity component (0-1) */
	a: number;
}

/**
 * HSB/HSV (Hue, Saturation, Brightness/Value) color space
 *
 * - Hue: 0-360° angle around the color wheel
 *   - 0° or 360° = red
 *   - 60° = yellow
 *   - 120° = green
 *   - 180° = cyan
 *   - 240° = blue
 *   - 300° = magenta
 *
 * - Saturation: 0-1 intensity of the color
 *   - 0 = grayscale (no color)
 *   - 1 = fully saturated color
 *
 * - Brightness/Value: 0-1 brightness of the color
 *   - 0 = black (no light)
 *   - 1 = full brightness
 *
 * - Alpha: 0-1 opacity
 *   - 0 = fully transparent
 *   - 1 = fully opaque
 *
 * Example:
 * - Red: { hue: 0, saturation: 1, brightness: 1, alpha: 1 }
 * - Green: { hue: 120, saturation: 1, brightness: 1, alpha: 1 }
 * - Dark blue: { hue: 240, saturation: 1, brightness: 0.5, alpha: 1 }
 * - Gray: { hue: 0, saturation: 0, brightness: 0.5, alpha: 1 }
 */
export interface THsba {
	/** Hue angle in degrees (0-360) */
	hue: number;
	/** Color saturation (0-1) */
	saturation: number;
	/** Color brightness (0-1) */
	brightness: number;
	/** Alpha/opacity value (0-1) */
	alpha: number;
}

export type THexColor = `#${string}`;
