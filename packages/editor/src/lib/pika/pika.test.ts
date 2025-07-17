import { describe, expect, it } from 'vitest';
import { Pika } from './pika';

describe('Pika', () => {
	const testPika = new Pika(
		[
			{ prefix: 'user', description: 'User accounts' },
			{ prefix: 'product' },
			{ prefix: 'node', description: 'Nodes' }
		],
		{ nodeId: 123 }
	);

	describe('constructor', () => {
		it('should create with prefixes and fixed nodeId', () => {
			expect(testPika.nodeId).toBe(123);
		});

		it('should create with random nodeId when not provided', () => {
			const pika = new Pika([{ prefix: 'test' }]);
			expect(pika.nodeId).toBeGreaterThanOrEqual(0);
			expect(pika.nodeId).toBeLessThan(1024);
		});
	});

	describe('gen method', () => {
		it('should generate prefixed IDs', () => {
			const userId = testPika.gen('user');
			expect(userId).toMatch(/^user_[A-Za-z0-9_-]+$/);
		});

		it('should generate unique IDs', () => {
			const id1 = testPika.gen('user');
			const id2 = testPika.gen('user');
			expect(id1).not.toBe(id2);
		});

		it('should work with all registered prefixes', () => {
			const userID = testPika.gen('user');
			const productID = testPika.gen('product');
			const nodeID = testPika.gen('node');

			expect(userID.startsWith('user_')).toBe(true);
			expect(productID.startsWith('product_')).toBe(true);
			expect(nodeID.startsWith('node_')).toBe(true);
		});

		it('should throw for unregistered prefix', () => {
			expect(() => {
				// @ts-expect-error - Testing runtime error
				testPika.gen('unknown');
			}).toThrow('Unknown prefix: unknown');
		});

		it('should include available prefixes in error', () => {
			expect(() => {
				// @ts-expect-error - Testing runtime error
				testPika.gen('invalid');
			}).toThrow('Available prefixes: user, product, node');
		});
	});

	describe('validate method', () => {
		it('should validate generated IDs', () => {
			const userId = testPika.gen('user');
			expect(testPika.validate(userId)).toBe(true);
		});

		it('should validate with specific prefix', () => {
			const userId = testPika.gen('user');
			expect(testPika.validate(userId, 'user')).toBe(true);
			expect(testPika.validate(userId, 'product')).toBe(false);
		});

		it('should reject invalid formats', () => {
			expect(testPika.validate('no-underscore')).toBe(false);
			expect(testPika.validate('user_invalid+chars/')).toBe(false);
			expect(testPika.validate('unknown_validchars')).toBe(false);
		});

		it('should reject non-string input', () => {
			expect(testPika.validate(123)).toBe(false);
		});
	});

	describe('deconstruct method', () => {
		it('should deconstruct generated IDs', () => {
			const userId = testPika.gen('user');
			const result = testPika.deconstruct(userId);

			expect(result).not.toBeNull();
			expect(result?.prefix).toBe('user');
			expect(result?.nodeId).toBe(123);
			expect(typeof result?.timestamp).toBe('bigint');
			expect(typeof result?.seq).toBe('number');
		});

		it('should handle multiple prefixes', () => {
			const userID = testPika.gen('user');
			const productID = testPika.gen('product');

			const userResult = testPika.deconstruct(userID);
			const productResult = testPika.deconstruct(productID);

			expect(userResult).not.toBeNull();
			expect(productResult).not.toBeNull();
			expect(userResult?.prefix).toBe('user');
			expect(productResult?.prefix).toBe('product');
		});

		it('should return null for invalid format', () => {
			const result = testPika.deconstruct('invalid');
			expect(result).toBeNull();
		});
	});

	describe('nodeId getter', () => {
		it('should return snowflake nodeId', () => {
			expect(testPika.nodeId).toBe(123);
		});
	});

	describe('type safety', () => {
		it('should maintain compile-time type safety', () => {
			const typedPika = new Pika([{ prefix: 'user' }, { prefix: 'product' }] as const);

			// These should compile without errors
			const userId = typedPika.gen('user');
			const productId = typedPika.gen('product');

			expect(userId.startsWith('user_')).toBe(true);
			expect(productId.startsWith('product_')).toBe(true);
		});
	});
});
