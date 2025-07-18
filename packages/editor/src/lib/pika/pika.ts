import { TPikaId } from './schema';
import { Snowflake, TDeconstructedSnowflake, TSnowflakeOptions } from './snowflake';

/**
 * Browser-compatible Pika ID generator with prefix-based type safety.
 *
 * Generates IDs in the format: `prefix_base64urlEncodedSnowflake`
 * Example: `user_MTIzNDU2Nzg5MDEy`, `product_OTg3NjU0MzIxMDk4`
 *
 * @example
 * ```typescript
 * const pika = new Pika([
 *   { prefix: 'user', description: 'User accounts' },
 *   { prefix: 'product', description: 'Products' }
 * ]);
 *
 * const userId = pika.gen('user');                // Returns: "user_MTIzNDU2Nzg5MDEy"
 * const isValid = pika.validate(userId, 'user'); // Returns: true
 * ```
 */
export class Pika<GPrefixes extends string> {
	private readonly _prefixes: Record<string, TPikaPrefixDefinition<GPrefixes>> = {};
	private readonly _snowflake: Snowflake;

	constructor(prefixes: readonly TPikaPrefixDefinition<GPrefixes>[], options: TPikaOptions = {}) {
		this._snowflake = new Snowflake(options);

		for (const definition of prefixes) {
			this._prefixes[definition.prefix] = definition;
		}
	}

	public get nodeId(): number {
		return this._snowflake.nodeId;
	}

	/**
	 * Generates a new ID with the specified prefix.
	 *
	 * @param prefix - The prefix to use (must be registered)
	 * @returns Typed ID string in format `prefix_snowflakeId`
	 * @throws Error if prefix is not registered
	 */
	public gen<GPrefix extends GPrefixes>(prefix: GPrefix): TPikaId<GPrefix> {
		if (!(prefix in this._prefixes)) {
			throw new Error(
				`Unknown prefix: ${prefix}. Available prefixes: ${Object.keys(this._prefixes).join(', ')}`
			);
		}

		return `${prefix}_${this._snowflake.gen()}`;
	}

	/**
	 * Validates if a string is a valid ID, optionally checking for a specific prefix.
	 *
	 * @param maybeId - String to validate
	 * @param expectPrefix - Optional specific prefix to validate against
	 * @returns Type-safe boolean indicating if the ID is valid
	 *
	 * @example
	 * ```typescript
	 * pika.validate('user_MTIzNDU2Nzg5MDEy');             // true
	 * pika.validate('user_MTIzNDU2Nzg5MDEy', 'user');     // true
	 * pika.validate('user_MTIzNDU2Nzg5MDEy', 'product');  // false
	 * pika.validate('invalid-format');                    // false
	 * ```
	 */
	public validate<GPrefix extends GPrefixes = GPrefixes>(
		maybeId: unknown,
		expectPrefix?: GPrefix
	): maybeId is TPikaId<GPrefix> {
		if (typeof maybeId !== 'string') {
			return false;
		}

		const result = this.deconstruct(maybeId);
		if (result == null) {
			return false;
		}

		// Check specific prefix if provided
		if (expectPrefix != null) {
			return result.prefix === expectPrefix;
		}

		return result.prefix in this._prefixes;
	}

	/**
	 * Deconstructs an ID back into its prefix and snowflake components.
	 *
	 * @param id - The ID to deconstruct
	 * @returns Deconstructed ID with prefix and snowflake details, or null if invalid format
	 *
	 * @example
	 * ```typescript
	 * const result = pika.deconstruct('user_MTIzNDU2Nzg5MDEy');
	 * // Returns: { prefix: 'user', timestamp: ..., nodeId: ..., seq: ..., ... }
	 *
	 * const invalid = pika.deconstruct('invalid');
	 * // Returns: null
	 * ```
	 */
	public deconstruct(id: string): TDeconstructedPika<GPrefixes> | null {
		const underscoreIndex = id.indexOf('_');
		if (underscoreIndex === -1) {
			return null;
		}

		const prefix = id.slice(0, underscoreIndex) as GPrefixes;
		const snowflakeId = id.slice(underscoreIndex + 1);

		let deconstructed;
		try {
			deconstructed = this._snowflake.deconstruct(snowflakeId);
		} catch {
			return null;
		}

		return {
			...deconstructed,
			prefix
		};
	}
}

export interface TPikaOptions extends TSnowflakeOptions {}

export interface TDeconstructedPika<GPrefixes extends string> extends TDeconstructedSnowflake {
	prefix: GPrefixes;
}

export interface TPikaPrefixDefinition<GPrefix extends string> {
	/** The prefix string (e.g., 'user', 'product') */
	prefix: GPrefix;
	/** Optional human-readable description */
	description?: string;
}
