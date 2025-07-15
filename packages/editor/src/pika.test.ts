import { describe, expect, it } from 'vitest';
import { Pika } from './pika';

describe('Pika ID Generator', () => {
	describe('Pika class', () => {
		const testPika = new Pika(
			[
				{ prefix: 'user', description: 'User accounts' },
				{ prefix: 'product', description: 'Products' },
				{ prefix: 'node', description: 'Nodes' }
			],
			123
		); // Fixed node ID for predictable testing

		describe('gen method', () => {
			it('should generate ID with correct prefix format', () => {
				const userId = testPika.gen('user');
				expect(userId).toMatch(/^user_[A-Za-z0-9_-]+$/);
			});

			it('should generate different IDs on subsequent calls', () => {
				const id1 = testPika.gen('user');
				const id2 = testPika.gen('user');
				expect(id1).not.toBe(id2);
			});

			it('should generate base64url encoded snowflakes', () => {
				const userId = testPika.gen('user');
				const [prefix, encodedId] = userId.split('_');

				expect(prefix).toBe('user');
				// Should be base64url format (no padding, URL-safe chars)
				expect(encodedId).toMatch(/^[A-Za-z0-9_-]+$/);
				expect(encodedId).not.toContain('='); // No padding
				expect(encodedId).not.toContain('+'); // No + chars
				expect(encodedId).not.toContain('/'); // No / chars
			});

			it('should throw error for unknown prefix', () => {
				expect(() => {
					// @ts-expect-error - Testing runtime error
					testPika.gen('unknown');
				}).toThrow('Unknown prefix: unknown');
			});

			it('should include available prefixes in error message', () => {
				expect(() => {
					// @ts-expect-error - Testing runtime error
					testPika.gen('invalid');
				}).toThrow('Available prefixes: user, product, node');
			});
		});

		describe('validate method', () => {
			it('should validate correct ID format', () => {
				const userId = testPika.gen('user');
				expect(testPika.validate(userId)).toBe(true);
			});

			it('should validate with specific prefix', () => {
				const userId = testPika.gen('user');
				expect(testPika.validate(userId, 'user')).toBe(true);
			});

			it('should reject ID with wrong prefix', () => {
				const userId = testPika.gen('user');
				expect(testPika.validate(userId, 'product')).toBe(false);
			});

			it('should reject invalid format without underscore', () => {
				expect(testPika.validate('invalidformat')).toBe(false);
			});

			it('should reject non-string input', () => {
				// @ts-expect-error - Testing runtime validation
				expect(testPika.validate(123)).toBe(false);
			});

			it('should reject invalid base64url characters', () => {
				expect(testPika.validate('user_invalid+chars/')).toBe(false);
			});

			it('should reject unregistered prefix', () => {
				expect(testPika.validate('unknown_MTIzNDU2')).toBe(false);
			});
		});

		describe('deconstruct method', () => {
			it('should deconstruct generated ID correctly', () => {
				const userId = testPika.gen('user');
				const result = testPika.deconstruct(userId);

				expect(result.prefix).toBe('user');
				expect(result.nodeId).toBe(123); // Our fixed node ID
				expect(typeof result.timestamp).toBe('bigint');
				expect(typeof result.seq).toBe('number');
				expect(result.seq).toBeGreaterThanOrEqual(0);
				expect(result.seq).toBeLessThan(4096);
			});

			it('should throw error for invalid ID format', () => {
				expect(() => {
					testPika.deconstruct('invalidformat');
				}).toThrow('Invalid ID format: invalidformat. Expected format: prefix_snowflakeId');
			});

			it('should handle deconstruction of multiple IDs in same millisecond', () => {
				const id1 = testPika.gen('user');
				const id2 = testPika.gen('user');

				const result1 = testPika.deconstruct(id1);
				const result2 = testPika.deconstruct(id2);

				// Should have different sequence numbers if in same millisecond
				if (result1.timestamp === result2.timestamp) {
					expect(result1.seq).not.toBe(result2.seq);
				}
			});
		});

		describe('nodeId getter', () => {
			it('should return the configured node ID', () => {
				expect(testPika.nodeId).toBe(123);
			});
		});
	});
});
