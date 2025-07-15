/**
 * This is a simplified, browser-compatible implementation inspired by the original Pika library:
 * @see https://github.com/hopinc/pika - Original Pika implementation by Hop Inc.
 *
 * Key differences from original:
 * - No Node.js dependencies (crypto, os, networkInterfaces)
 * - Uses Math.random() instead of MAC address for node ID
 */

/**
 * Browser-compatible Snowflake ID generator.
 *
 * Generates 64-bit unique IDs with the following structure:
 * - 42 bits: Milliseconds since epoch (Jan 1, 2022)
 * - 10 bits: Node ID (0-1023)
 * - 12 bits: Sequence number (0-4095)
 *
 * This allows generating up to 4096 unique IDs per millisecond per node.
 */
class Snowflake {
	/** Epoch timestamp (Jan 1, 2022) used as time baseline */
	private readonly _epoch: bigint;
	/** Unique node identifier (0-1023) */
	private readonly _nodeId: bigint;
	/** Rolling sequence number within current millisecond */
	private _sequence = 0n;
	/** Last timestamp we generated an ID for */
	private _lastTimestamp = 0n;

	/**
	 * Creates a new Snowflake generator.
	 *
	 * @param epoch - Base epoch for timestamp calculation
	 * @param nodeId - Unique node identifier (0-1023)
	 */
	constructor(epoch: TEpochResolvable, nodeId: number | bigint) {
		// Check BigInt support (required for 64-bit snowflakes)
		if (typeof BigInt === 'undefined') {
			throw new Error(
				'BigInt is required but not supported in this environment. Please update to ES2020+ or use a polyfill.'
			);
		}

		this._epoch = this._normalizeEpoch(epoch);
		this._nodeId = BigInt(nodeId) & 0b1111111111n; // Ensure 10 bits max
	}

	/**
	 * Gets the node ID for this Snowflake instance.
	 */
	public get nodeId(): number {
		return Number(this._nodeId);
	}

	/**
	 * Generates a new snowflake ID.
	 *
	 * @param options - Generation options
	 * @returns Snowflake ID as base64url-encoded string
	 */
	public gen(options: TSnowflakeGenOptions = {}): string {
		const timestamp = this._normalizeEpoch(options.timestamp ?? Date.now());

		// Handle sequence within same millisecond
		if (timestamp === this._lastTimestamp) {
			this._sequence = (this._sequence + 1n) & 0xfffn; // 12 bits max

			// Sequence overflow - wait for next millisecond
			if (this._sequence === 0n) {
				this._waitForNextMillisecond();
				return this.gen(options);
			}
		} else {
			this._sequence = 0n; // Reset sequence for new millisecond
		}

		this._lastTimestamp = timestamp;

		// Construct 64-bit snowflake: [42-bit timestamp][10-bit node][12-bit sequence]
		const snowflake =
			((timestamp - this._epoch) << 22n) | // Timestamp in upper 42 bits
			(this._nodeId << 12n) | // Node ID in middle 10 bits
			this._sequence; // Sequence in lower 12 bits

		// Encode as base64url for shorter, URL-safe IDs
		return this._encodeBase64Url(snowflake.toString());
	}

	/**
	 * Deconstructs a snowflake ID back into its components.
	 *
	 * @param id - Snowflake ID to deconstruct (base64url string or bigint)
	 * @returns Deconstructed components
	 */
	public deconstruct(id: string | bigint): TDeconstructedSnowflake {
		// If string, decode from base64url first
		const numericId = typeof id === 'string' ? this._decodeBase64Url(id) : id.toString();
		const bigIntId = BigInt(numericId);

		return {
			id: bigIntId,
			timestamp: (bigIntId >> 22n) + this._epoch,
			nodeId: Number((bigIntId >> 12n) & 0b1111111111n),
			seq: Number(bigIntId & 0b111111111111n),
			epoch: this._epoch
		};
	}

	/**
	 * Converts various epoch formats to bigint milliseconds.
	 */
	private _normalizeEpoch(epoch: TEpochResolvable): bigint {
		return BigInt(epoch instanceof Date ? epoch.getTime() : epoch);
	}

	/**
	 * Busy-waits until the next millisecond to handle sequence overflow.
	 */
	private _waitForNextMillisecond(): void {
		let currentTime = Date.now();
		while (currentTime <= Number(this._lastTimestamp)) {
			currentTime = Date.now();
		}
	}

	/**
	 * Encodes a string to base64url format (URL-safe base64).
	 */
	private _encodeBase64Url(str: string): string {
		// Use browser's built-in btoa, then convert to URL-safe format
		return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); // Remove padding
	}

	/**
	 * Decodes a base64url string back to the original string.
	 */
	private _decodeBase64Url(base64url: string): string {
		// Convert back to standard base64, then decode
		let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

		// Add padding if needed
		while (base64.length % 4) {
			base64 += '=';
		}

		return atob(base64);
	}
}

type TEpochResolvable = number | bigint | Date;

interface TSnowflakeGenOptions {
	/** Custom timestamp to use instead of current time */
	timestamp?: TEpochResolvable;
}

interface TDeconstructedSnowflake {
	/** The original snowflake ID as bigint */
	id: bigint;
	/** Timestamp when the ID was generated */
	timestamp: bigint;
	/** Node ID that generated this snowflake */
	nodeId: number;
	/** Sequence number for this millisecond */
	seq: number;
	/** Epoch used for timestamp calculation */
	epoch: bigint;
}

interface TPrefixDefinition<GPrefix extends string> {
	/** The prefix string (e.g., 'user', 'product') */
	prefix: GPrefix;
	/** Optional human-readable description */
	description?: string;
}

/**
 * Browser-compatible Pika ID generator with prefix-based type safety.
 *
 * Generates IDs in the format: `prefix_base64urlEncodedSnowflake`
 * Example: `user_MTIzNDU2Nzg5MDEy`, `product_OTg3NjU0MzIxMDk4`
 *
 * @template GPrefixes - Union type of allowed prefixes
 *
 * @example
 * ```typescript
 * const pika = new Pika([
 *   { prefix: 'user', description: 'User accounts' },
 *   { prefix: 'product', description: 'Products' }
 * ]);
 *
 * const userId = pika.gen('user');     // Returns: "user_MTIzNDU2Nzg5MDEy"
 * const isValid = pika.validate(userId, 'user'); // Returns: true
 * ```
 */
export class Pika<GPrefixes extends string> {
	/** Registry of valid prefixes */
	private readonly _prefixes: Record<string, TPrefixDefinition<GPrefixes>> = {};
	/** Underlying snowflake generator */
	private readonly _snowflake: Snowflake;

	/**
	 * Creates a new Pika instance with the specified prefixes.
	 *
	 * @param prefixes - Array of prefix definitions
	 * @param nodeId - Optional custom node ID (0-1023). If not provided, generates random one.
	 */
	constructor(prefixes: readonly TPrefixDefinition<GPrefixes>[], nodeId?: number) {
		const finalNodeId = nodeId ?? this._generateRandomNodeId();
		this._snowflake = new Snowflake(1640995200000n, finalNodeId); // Jan 1 2022 epoch

		// Register all prefix definitions
		for (const definition of prefixes) {
			this._prefixes[definition.prefix] = definition;
		}
	}

	/**
	 * Generates a new ID with the specified prefix.
	 *
	 * @param prefix - The prefix to use (must be registered)
	 * @returns Typed ID string in format `prefix_snowflakeId`
	 * @throws Error if prefix is not registered
	 *
	 * @example
	 * ```typescript
	 * const userId = pika.gen('user');     // "user_MTIzNDU2Nzg5MDEy"
	 * const productId = pika.gen('product'); // "product_OTg3NjU0MzIxMDk4"
	 * ```
	 */
	public gen<GPrefix extends GPrefixes>(prefix: GPrefix): `${GPrefix}_${string}` {
		if (!(prefix in this._prefixes)) {
			throw new Error(
				`Unknown prefix: ${prefix}. Available prefixes: ${Object.keys(this._prefixes).join(', ')}`
			);
		}

		const id = this._snowflake.gen();
		return `${prefix}_${id}`;
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
	 * pika.validate('user_MTIzNDU2Nzg5MDEy');        // true
	 * pika.validate('user_MTIzNDU2Nzg5MDEy', 'user'); // true
	 * pika.validate('user_MTIzNDU2Nzg5MDEy', 'product'); // false
	 * pika.validate('invalid-format');               // false
	 * ```
	 */
	public validate<GPrefix extends GPrefixes = GPrefixes>(
		maybeId: string,
		expectPrefix?: GPrefix
	): maybeId is `${GPrefix}_${string}` {
		if (typeof maybeId !== 'string') {
			return false;
		}

		const underscoreIndex = maybeId.indexOf('_');
		if (underscoreIndex === -1) {
			return false;
		}

		const prefix = maybeId.slice(0, underscoreIndex);
		const tail = maybeId.slice(underscoreIndex + 1);

		// Validate snowflake part is base64url format
		if (!/^[A-Za-z0-9_-]+$/.test(tail)) {
			return false;
		}

		// Check specific prefix if provided
		if (expectPrefix != null) {
			return prefix === expectPrefix;
		}

		// Check if prefix is registered
		return prefix in this._prefixes;
	}

	/**
	 * Deconstructs an ID back into its prefix and snowflake components.
	 *
	 * @param id - The ID to deconstruct
	 * @returns Deconstructed ID with prefix and snowflake details
	 * @throws Error if ID format is invalid
	 *
	 * @example
	 * ```typescript
	 * const result = pika.deconstruct('user_MTIzNDU2Nzg5MDEy');
	 * // Returns: { prefix: 'user', timestamp: ..., nodeId: ..., seq: ..., ... }
	 * ```
	 */
	public deconstruct(id: string): TDeconstructedSnowflake & { prefix: GPrefixes } {
		const underscoreIndex = id.indexOf('_');
		if (underscoreIndex === -1) {
			throw new Error(`Invalid ID format: ${id}. Expected format: prefix_snowflakeId`);
		}

		const prefix = id.slice(0, underscoreIndex) as GPrefixes;
		const snowflakeId = id.slice(underscoreIndex + 1);

		const deconstructed = this._snowflake.deconstruct(snowflakeId);

		return {
			...deconstructed,
			prefix
		};
	}

	/**
	 * Gets the node ID for this Pika instance.
	 */
	public get nodeId(): number {
		return this._snowflake.nodeId;
	}

	/**
	 * Generates a random 10-bit node ID (0-1023).
	 */
	private _generateRandomNodeId(): number {
		return Math.floor(Math.random() * 1024);
	}
}

export type TInferPrefixes<GPika extends Pika<any>> = GPika extends Pika<infer P> ? P : never;

export type TInferIds<GPika extends Pika<any>> =
	GPika extends Pika<infer P> ? `${P}_${string}` : never;
