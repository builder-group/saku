import { describe, expect, it } from 'vitest';
import { defaultBase64UrlDecode, defaultBase64UrlEncode } from './base64';

describe('base64 functions', () => {
	describe('defaultBase64UrlEncode', () => {
		it('should encode strings to base64url format', () => {
			expect(defaultBase64UrlEncode('hello')).toBe('aGVsbG8');
			expect(defaultBase64UrlEncode('1234567890')).toBe('MTIzNDU2Nzg5MA');
		});

		it('should remove padding characters', () => {
			const result = defaultBase64UrlEncode('sure.');
			expect(result).not.toContain('=');
			expect(result).toBe('c3VyZS4');
		});

		it('should use URL-safe characters', () => {
			const result = defaultBase64UrlEncode('???>');
			expect(result).not.toContain('+');
			expect(result).not.toContain('/');
		});

		it('should handle empty string', () => {
			expect(defaultBase64UrlEncode('')).toBe('');
		});
	});

	describe('defaultBase64UrlDecode', () => {
		it('should decode base64url strings', () => {
			expect(defaultBase64UrlDecode('aGVsbG8')).toBe('hello');
			expect(defaultBase64UrlDecode('MTIzNDU2Nzg5MA')).toBe('1234567890');
		});

		it('should handle missing padding', () => {
			expect(defaultBase64UrlDecode('c3VyZS4')).toBe('sure.');
		});

		it('should handle URL-safe characters', () => {
			const encoded = defaultBase64UrlEncode('???>');
			expect(defaultBase64UrlDecode(encoded)).toBe('???>');
		});

		it('should handle empty string', () => {
			expect(defaultBase64UrlDecode('')).toBe('');
		});
	});

	describe('encode/decode roundtrip', () => {
		it('should maintain data integrity', () => {
			const testCases = [
				'simple text',
				'1234567890',
				'special chars: !@#$%^&*()',
				'snowflake_12345678901234567890',
				''
			];

			for (const input of testCases) {
				const encoded = defaultBase64UrlEncode(input);
				const decoded = defaultBase64UrlDecode(encoded);
				expect(decoded).toBe(input);
			}
		});
	});
});
