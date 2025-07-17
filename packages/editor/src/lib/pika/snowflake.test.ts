import { describe, expect, it } from 'vitest';
import { Snowflake } from './snowflake';

describe('Snowflake', () => {
	describe('constructor', () => {
		it('should create with default config', () => {
			const snowflake = new Snowflake({});
			expect(snowflake.nodeId).toBeGreaterThanOrEqual(0);
			expect(snowflake.nodeId).toBeLessThan(1024);
		});

		it('should use custom nodeId', () => {
			const snowflake = new Snowflake({ nodeId: 123 });
			expect(snowflake.nodeId).toBe(123);
		});

		it('should clamp nodeId to 10 bits', () => {
			const snowflake = new Snowflake({ nodeId: 2048 }); // > 1024
			expect(snowflake.nodeId).toBeLessThan(1024);
		});

		it('should use custom epoch', () => {
			const customEpoch = 1700000000000n;
			const snowflake = new Snowflake({ epoch: customEpoch });
			const id = snowflake.gen();
			const result = snowflake.deconstruct(id);
			expect(result.epoch).toBe(customEpoch);
		});
	});

	describe('gen method', () => {
		const snowflake = new Snowflake({ nodeId: 0 });

		it('should generate string IDs', () => {
			const id = snowflake.gen();
			expect(typeof id).toBe('string');
			expect(id.length).toBeGreaterThan(0);
		});

		it('should generate unique IDs', () => {
			const ids = new Set();
			for (let i = 0; i < 100; i++) {
				ids.add(snowflake.gen());
			}
			expect(ids.size).toBe(100);
		});

		it('should use custom timestamp', () => {
			const timestamp = Date.now() - 1000;
			const id = snowflake.gen({ timestamp });
			const result = snowflake.deconstruct(id);

			// Timestamp should be close to what we provided
			const diff = Math.abs(Number(result.timestamp) - timestamp);
			expect(diff).toBeLessThan(10); // Allow small variance
		});

		it('should handle sequence overflow', () => {
			const testSnowflake = new Snowflake({ nodeId: 0 });
			const timestamp = Date.now();

			// Generate many IDs with same timestamp to trigger sequence increment
			const ids = [];
			for (let i = 0; i < 10; i++) {
				ids.push(testSnowflake.gen({ timestamp }));
			}

			// All should be unique
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(ids.length);
		});
	});

	describe('deconstruct method', () => {
		const snowflake = new Snowflake({ nodeId: 42 });

		it('should deconstruct generated IDs', () => {
			const id = snowflake.gen();
			const result = snowflake.deconstruct(id);

			expect(result.nodeId).toBe(42);
			expect(typeof result.timestamp).toBe('bigint');
			expect(typeof result.seq).toBe('number');
			expect(result.seq).toBeGreaterThanOrEqual(0);
			expect(result.seq).toBeLessThan(4096);
		});

		it('should handle bigint input', () => {
			const id = snowflake.gen();
			const decoded = snowflake.deconstruct(id);
			const result = snowflake.deconstruct(decoded.id);

			expect(result.nodeId).toBe(42);
			expect(result.timestamp).toBe(decoded.timestamp);
		});

		it('should preserve sequence info', () => {
			const timestamp = Date.now();
			const id1 = snowflake.gen({ timestamp });
			const id2 = snowflake.gen({ timestamp });

			const result1 = snowflake.deconstruct(id1);
			const result2 = snowflake.deconstruct(id2);

			expect(result2.seq).toBe(result1.seq + 1);
		});
	});

	describe('custom encoders', () => {
		it('should use custom encode function', () => {
			const customEncode = (str: string) => `custom_${str}`;
			const customDecode = (str: string) => str.replace('custom_', '');

			const snowflake = new Snowflake({
				nodeId: 0,
				encode: customEncode,
				decode: customDecode
			});

			const id = snowflake.gen();
			expect(id.startsWith('custom_')).toBe(true);
		});

		it('should roundtrip with custom encoders', () => {
			const customEncode = (str: string) => `prefix_${str}_suffix`;
			const customDecode = (str: string) => str.replace('prefix_', '').replace('_suffix', '');

			const snowflake = new Snowflake({
				nodeId: 123,
				encode: customEncode,
				decode: customDecode
			});

			const id = snowflake.gen();
			const result = snowflake.deconstruct(id);
			expect(result.nodeId).toBe(123);
		});
	});

	describe('BigInt support', () => {
		it('should throw error when BigInt unavailable', () => {
			const originalBigInt = globalThis.BigInt;
			// @ts-expect-error - Testing runtime scenario
			globalThis.BigInt = undefined;

			expect(() => new Snowflake({})).toThrow('BigInt is required');

			globalThis.BigInt = originalBigInt;
		});
	});

	describe('epoch normalization', () => {
		it('should handle Date objects', () => {
			const date = new Date('2022-01-01');
			const snowflake = new Snowflake({ epoch: date });
			const id = snowflake.gen();
			const result = snowflake.deconstruct(id);
			expect(result.epoch).toBe(BigInt(date.getTime()));
		});

		it('should handle number epoch', () => {
			const epoch = 1640995200000;
			const snowflake = new Snowflake({ epoch });
			const id = snowflake.gen();
			const result = snowflake.deconstruct(id);
			expect(result.epoch).toBe(BigInt(epoch));
		});
	});
});
