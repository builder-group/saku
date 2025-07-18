import { defaultBase64UrlDecode, defaultBase64UrlEncode } from './base64';

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
export class Snowflake {
	private readonly _config: Required<TSnowflakeConfig>;

	/** Rolling sequence number within current millisecond */
	private _sequence = 0n;
	/** Last timestamp we generated an ID for */
	private _lastTimestamp = 0n;

	constructor(options: TSnowflakeOptions) {
		const {
			epoch = 1640995200000n, // Jan 1 2022 epoch,
			nodeId = Math.floor(Math.random() * 1024),
			encode = defaultBase64UrlEncode,
			decode = defaultBase64UrlDecode
		} = options;

		// Check BigInt support (required for 64-bit snowflakes)
		if (typeof BigInt === 'undefined') {
			throw new Error(
				'BigInt is required but not supported in this environment. Please update to ES2020+ or use a polyfill.'
			);
		}

		this._config = {
			epoch: this._normalizeEpoch(epoch),
			nodeId: BigInt(nodeId) & 0b1111111111n, // Ensure 10 bits max
			encode,
			decode
		};
	}

	public get nodeId(): number {
		return Number(this._config.nodeId);
	}

	/**
	 * Generates a new snowflake ID.
	 *
	 * @param options - Generation options
	 * @returns Snowflake ID as encoded string
	 */
	public gen(options: TSnowflakeGenOptions = {}): string {
		const { timestamp = Date.now() } = options;
		const normalizedTimestamp = this._normalizeEpoch(timestamp);

		// Handle sequence within same millisecond
		if (normalizedTimestamp === this._lastTimestamp) {
			this._sequence = (this._sequence + 1n) & 0xfffn; // 12 bits max

			// Sequence overflow - wait for next millisecond
			// Note: This busy-waits for ~1ms, which only happens at 4096+ IDs/ms (4M+ IDs/sec).
			// We keep this synchronous for API simplicity since this edge case is extremely rare.
			if (this._sequence === 0n) {
				this._waitForNextMillisecond();
				return this.gen(options);
			}
		} else {
			this._sequence = 0n; // Reset sequence for new millisecond
		}

		this._lastTimestamp = normalizedTimestamp;

		// Construct 64-bit snowflake: [42-bit timestamp][10-bit node][12-bit sequence]
		const snowflake =
			((normalizedTimestamp - this._config.epoch) << 22n) | // Timestamp in upper 42 bits
			(this._config.nodeId << 12n) | // Node ID in middle 10 bits
			this._sequence; // Sequence in lower 12 bits

		return this._config.encode(snowflake.toString());
	}

	/**
	 * Deconstructs a snowflake ID back into its components.
	 *
	 * @param id - Snowflake ID to deconstruct (encoded string or bigint)
	 * @returns Deconstructed components
	 */
	public deconstruct(id: string | bigint): TDeconstructedSnowflake {
		const numericId = typeof id === 'string' ? this._config.decode(id) : id.toString();
		const bigIntId = BigInt(numericId);

		return {
			id: bigIntId,
			timestamp: (bigIntId >> 22n) + this._config.epoch,
			nodeId: Number((bigIntId >> 12n) & 0b1111111111n),
			seq: Number(bigIntId & 0b111111111111n),
			epoch: this._config.epoch
		};
	}

	private _normalizeEpoch(epoch: TEpochResolvable): bigint {
		return BigInt(epoch instanceof Date ? epoch.getTime() : epoch);
	}

	private _waitForNextMillisecond(): void {
		let currentTime = Date.now();
		while (currentTime <= Number(this._lastTimestamp)) {
			currentTime = Date.now();
		}
	}
}

export interface TSnowflakeOptions {
	/** Base epoch for timestamp calculation */
	epoch?: TEpochResolvable;
	/** Unique node identifier (0-1023) */
	nodeId?: number | bigint;
	/** Function to encode snowflake string (default: base64url) */
	encode?: (str: string) => string;
	/** Function to decode encoded string back to snowflake (default: base64url) */
	decode?: (encoded: string) => string;
}

export interface TSnowflakeConfig {
	epoch: bigint;
	nodeId: bigint;
	encode: (str: string) => string;
	decode: (encoded: string) => string;
}

export interface TSnowflakeGenOptions {
	/** Custom timestamp to use instead of current time */
	timestamp?: TEpochResolvable;
}

export type TEpochResolvable = number | bigint | Date;

export interface TDeconstructedSnowflake {
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
