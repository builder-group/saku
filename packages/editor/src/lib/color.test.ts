import { describe, expect, it } from 'vitest';
import {
	cssRgbaToRgba,
	hexToRgba,
	hsbaToRgba,
	rgbaToCssRgba,
	rgbaToHex,
	rgbaToHsba,
	THsba,
	TRgba
} from './color';

describe('Color conversion', () => {
	describe('Color space ranges', () => {
		it('should properly handle RGBA ranges (0-1)', () => {
			const rgba: TRgba = { r: 0.5, g: 0.25, b: 0.75, a: 0.5 };
			const hsba = rgbaToHsba(rgba);
			const backToRgba = hsbaToRgba(hsba);

			// Verify RGBA values stay in 0-1 range
			expect(backToRgba.r).toBeGreaterThanOrEqual(0);
			expect(backToRgba.r).toBeLessThanOrEqual(1);
			expect(backToRgba.g).toBeGreaterThanOrEqual(0);
			expect(backToRgba.g).toBeLessThanOrEqual(1);
			expect(backToRgba.b).toBeGreaterThanOrEqual(0);
			expect(backToRgba.b).toBeLessThanOrEqual(1);
			expect(backToRgba.a).toBeGreaterThanOrEqual(0);
			expect(backToRgba.a).toBeLessThanOrEqual(1);
		});

		it('should properly handle HSBA ranges (hue: 0-360, saturation/brightness: 0-1, alpha: 0-1)', () => {
			const hsba: THsba = { hue: 180, saturation: 0.5, brightness: 0.75, alpha: 0.5 };
			const rgba = hsbaToRgba(hsba);
			const backToHsba = rgbaToHsba(rgba);

			// Verify hue stays in 0-360 range
			expect(backToHsba.hue).toBeGreaterThanOrEqual(0);
			expect(backToHsba.hue).toBeLessThanOrEqual(360);

			// Verify saturation stays in 0-1 range
			expect(backToHsba.saturation).toBeGreaterThanOrEqual(0);
			expect(backToHsba.saturation).toBeLessThanOrEqual(1);

			// Verify brightness stays in 0-1 range
			expect(backToHsba.brightness).toBeGreaterThanOrEqual(0);
			expect(backToHsba.brightness).toBeLessThanOrEqual(1);

			// Verify alpha stays in 0-1 range
			expect(backToHsba.alpha).toBeGreaterThanOrEqual(0);
			expect(backToHsba.alpha).toBeLessThanOrEqual(1);
		});

		it('should clamp out-of-range values to valid ranges', () => {
			// Test RGBA clamping
			const rgba = hsbaToRgba({ hue: 400, saturation: 1.5, brightness: -0.5, alpha: 2 });
			expect(rgba.r).toBeGreaterThanOrEqual(0);
			expect(rgba.r).toBeLessThanOrEqual(1);
			expect(rgba.g).toBeGreaterThanOrEqual(0);
			expect(rgba.g).toBeLessThanOrEqual(1);
			expect(rgba.b).toBeGreaterThanOrEqual(0);
			expect(rgba.b).toBeLessThanOrEqual(1);
			expect(rgba.a).toBeGreaterThanOrEqual(0);
			expect(rgba.a).toBeLessThanOrEqual(1);

			// Test HSBA clamping
			const hsba = rgbaToHsba({ r: -0.5, g: 1.5, b: 2, a: 2 });
			expect(hsba.hue).toBeGreaterThanOrEqual(0);
			expect(hsba.hue).toBeLessThanOrEqual(360);
			expect(hsba.saturation).toBeGreaterThanOrEqual(0);
			expect(hsba.saturation).toBeLessThanOrEqual(1);
			expect(hsba.brightness).toBeGreaterThanOrEqual(0);
			expect(hsba.brightness).toBeLessThanOrEqual(1);
			expect(hsba.alpha).toBeGreaterThanOrEqual(0);
			expect(hsba.alpha).toBeLessThanOrEqual(1);
		});
	});

	describe('hexToRgba', () => {
		it('should convert valid hex colors', () => {
			expect(hexToRgba('#000000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
			expect(hexToRgba('#FFFFFF')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
			expect(hexToRgba('#0066cc')).toEqual({ r: 0, g: 0.4, b: 0.8, a: 1 });
			expect(hexToRgba('#0066cc80')).toEqual({ r: 0, g: 0.4, b: 0.8, a: 0.5019607843137255 });
		});

		it('should handle shorthand hex', () => {
			expect(hexToRgba('#000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
			expect(hexToRgba('#fff')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
			expect(hexToRgba('#06c')).toEqual({ r: 0, g: 0.4, b: 0.8, a: 1 });
			expect(hexToRgba('#06cf')).toEqual({ r: 0, g: 0.4, b: 0.8, a: 1 });
		});

		it('should return white for invalid hex', () => {
			expect(hexToRgba('')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
			expect(hexToRgba('invalid')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
			expect(hexToRgba('#XYZ')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
			expect(hexToRgba('#12')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
			expect(hexToRgba('#12345')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
		});
	});

	describe('rgbaToHex', () => {
		it('should convert RGBA to hex', () => {
			expect(rgbaToHex({ r: 0, g: 0, b: 0, a: 1 })).toBe('#000000');
			expect(rgbaToHex({ r: 1, g: 1, b: 1, a: 1 })).toBe('#ffffff');
			expect(rgbaToHex({ r: 0, g: 0.4, b: 0.8, a: 1 })).toBe('#0066cc');
		});

		it('should handle out of range values', () => {
			expect(rgbaToHex({ r: -0.5, g: 1.5, b: 1, a: 1 })).toBe('#00ffff');
			expect(rgbaToHex({ r: 0.004, g: 0.496, b: 0.996, a: 1 })).toBe('#017efe');
		});
	});

	describe('hsbaToRgba', () => {
		it('should convert HSB to RGBA', () => {
			// Primary colors
			expect(hsbaToRgba({ hue: 0, saturation: 1, brightness: 1, alpha: 1 })).toEqual({
				r: 1,
				g: 0,
				b: 0,
				a: 1
			});
			expect(hsbaToRgba({ hue: 120, saturation: 1, brightness: 1, alpha: 1 })).toEqual({
				r: 0,
				g: 1,
				b: 0,
				a: 1
			});
			expect(hsbaToRgba({ hue: 240, saturation: 1, brightness: 1, alpha: 1 })).toEqual({
				r: 0,
				g: 0,
				b: 1,
				a: 1
			});

			// Secondary colors
			expect(hsbaToRgba({ hue: 60, saturation: 1, brightness: 1, alpha: 1 })).toEqual({
				r: 1,
				g: 1,
				b: 0,
				a: 1
			});
			expect(hsbaToRgba({ hue: 180, saturation: 1, brightness: 1, alpha: 1 })).toEqual({
				r: 0,
				g: 1,
				b: 1,
				a: 1
			});
			expect(hsbaToRgba({ hue: 300, saturation: 1, brightness: 1, alpha: 1 })).toEqual({
				r: 1,
				g: 0,
				b: 1,
				a: 1
			});
		});

		it('should handle edge cases', () => {
			// Hue wraps around
			expect(hsbaToRgba({ hue: 360, saturation: 1, brightness: 1, alpha: 1 })).toEqual(
				hsbaToRgba({ hue: 0, saturation: 1, brightness: 1, alpha: 1 })
			);
			expect(hsbaToRgba({ hue: -120, saturation: 1, brightness: 1, alpha: 1 })).toEqual(
				hsbaToRgba({ hue: 240, saturation: 1, brightness: 1, alpha: 1 })
			);

			// Zero saturation = grayscale
			expect(hsbaToRgba({ hue: 210, saturation: 0, brightness: 0.5, alpha: 1 })).toEqual({
				r: 0.5,
				g: 0.5,
				b: 0.5,
				a: 1
			});

			// Out of range values
			expect(hsbaToRgba({ hue: 0, saturation: 1.5, brightness: -0.5, alpha: 2 })).toEqual({
				r: 0,
				g: 0,
				b: 0,
				a: 1
			});
		});
	});

	describe('rgbaToHsba', () => {
		it('should convert RGBA to HSB', () => {
			// Primary colors
			expect(rgbaToHsba({ r: 1, g: 0, b: 0, a: 1 })).toEqual({
				hue: 0,
				saturation: 1,
				brightness: 1,
				alpha: 1
			});
			expect(rgbaToHsba({ r: 0, g: 1, b: 0, a: 1 })).toEqual({
				hue: 120,
				saturation: 1,
				brightness: 1,
				alpha: 1
			});
			expect(rgbaToHsba({ r: 0, g: 0, b: 1, a: 1 })).toEqual({
				hue: 240,
				saturation: 1,
				brightness: 1,
				alpha: 1
			});

			// Grayscale
			expect(rgbaToHsba({ r: 0, g: 0, b: 0, a: 1 })).toEqual({
				hue: 0,
				saturation: 0,
				brightness: 0,
				alpha: 1
			});
			expect(rgbaToHsba({ r: 1, g: 1, b: 1, a: 1 })).toEqual({
				hue: 0,
				saturation: 0,
				brightness: 1,
				alpha: 1
			});
		});

		it('should handle out of range values', () => {
			expect(rgbaToHsba({ r: -0.5, g: 1.5, b: 1, a: 2 })).toEqual({
				hue: 180,
				saturation: 1,
				brightness: 1,
				alpha: 1
			});
		});
	});

	describe('CSS color conversion', () => {
		it('should convert between RGBA and CSS colors', () => {
			const rgba: TRgba = { r: 0, g: 0.4, b: 0.8, a: 1 };
			const css = rgbaToCssRgba(rgba);
			expect(css).toBe('rgb(0 102 204)');
			expect(cssRgbaToRgba(css)).toEqual(rgba);
		});

		it('should handle alpha values', () => {
			const rgba: TRgba = { r: 0, g: 0.4, b: 0.8, a: 0.5 };
			const css = rgbaToCssRgba(rgba);
			expect(css).toBe('rgb(0 102 204 / 0.5)');
			expect(cssRgbaToRgba(css)).toEqual(rgba);
		});

		it('should handle invalid CSS colors', () => {
			expect(cssRgbaToRgba(null)).toBeUndefined();
			expect(cssRgbaToRgba(undefined)).toBeUndefined();
			expect(cssRgbaToRgba('invalid')).toBeUndefined();
			expect(cssRgbaToRgba('rgb()')).toBeUndefined();
			expect(cssRgbaToRgba('rgb(1 2)')).toBeUndefined();
			expect(cssRgbaToRgba('rgb(256 300 -1)')).toBeUndefined();
			expect(cssRgbaToRgba('rgb(0 0 0 / 1.1)')).toBeUndefined();
		});

		it('should handle out of range values', () => {
			const rgba: TRgba = { r: -0.5, g: 1.5, b: 2, a: 2 };
			const css = rgbaToCssRgba(rgba);
			expect(css).toBe('rgb(0 255 255)');
		});
	});

	describe('Color conversion roundtrip', () => {
		it('should preserve colors through conversion', () => {
			const original: TRgba = { r: 0, g: 0.4, b: 0.8, a: 1 };
			const hex = rgbaToHex(original);
			const fromHex = hexToRgba(hex);
			expect(fromHex).toEqual(original);

			const hsba = rgbaToHsba(original);
			const fromHsba = hsbaToRgba(hsba);
			expect(fromHsba).toEqual(original);

			const css = rgbaToCssRgba(original);
			const fromCss = cssRgbaToRgba(css);
			expect(fromCss).toEqual(original);
		});

		it('should preserve primary and secondary colors', () => {
			const colors: TRgba[] = [
				{ r: 1, g: 0, b: 0, a: 1 }, // Red
				{ r: 0, g: 1, b: 0, a: 1 }, // Green
				{ r: 0, g: 0, b: 1, a: 1 }, // Blue
				{ r: 1, g: 1, b: 0, a: 1 }, // Yellow
				{ r: 0, g: 1, b: 1, a: 1 }, // Cyan
				{ r: 1, g: 0, b: 1, a: 1 } // Magenta
			];

			for (const color of colors) {
				const hsba = rgbaToHsba(color);
				const back = hsbaToRgba(hsba);
				expect(back).toEqual(color);
			}
		});
	});
});
