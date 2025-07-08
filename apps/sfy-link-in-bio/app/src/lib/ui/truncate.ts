/**
 * Truncates text based on configuration
 * @example
 * ```ts
 * truncate("hello world", { maxLength: 8 })
 * // { text: "hello...", isTruncated: true }
 *
 * truncate("hello world", { maxLength: 8, mode: 'center' })
 * // { text: "he...rld", isTruncated: true }
 *
 * truncate("hello world", { maxLength: 8, mode: 'start', ellipsis: '>' })
 * // { text: ">world", isTruncated: true }
 * ```
 */
export function truncate(text: string, config: TTruncateConfig): TTruncateResult {
	const { maxLength, mode = 'end', ellipsis = '...' } = config;

	// Return original if it fits
	if (text.length <= maxLength) {
		return { text, isTruncated: false };
	}

	// Account for the ellipsis in the max length
	const netMaxLength = maxLength - ellipsis.length;

	switch (mode) {
		case 'center': {
			const startLength = Math.ceil(netMaxLength / 2);
			const endLength = Math.floor(netMaxLength / 2);
			const start = text.slice(0, startLength);
			const end = text.slice(-endLength);
			return {
				text: `${start}${ellipsis}${end}`,
				isTruncated: true
			};
		}

		case 'start': {
			const end = text.slice(-netMaxLength);
			return {
				text: `${ellipsis}${end}`,
				isTruncated: true
			};
		}

		case 'end':
		default: {
			const start = text.slice(0, netMaxLength);
			return {
				text: `${start}${ellipsis}`,
				isTruncated: true
			};
		}
	}
}

export interface TTruncateConfig {
	/** Maximum length of the truncated text (including ellipsis) */
	maxLength: number;
	/** Where to place the ellipsis */
	mode?: TTruncateMode;
	/** String to use as ellipsis */
	ellipsis?: string;
}

/**
 * Truncation mode determines where to place the ellipsis
 * - center: truncate in the middle (e.g., "start...end")
 * - end: truncate at the end (e.g., "beginning...")
 * - start: truncate at the start (e.g., "...end")
 */
export type TTruncateMode = 'center' | 'end' | 'start';

export interface TTruncateResult {
	/** The truncated text */
	text: string;
	/** Whether the text was truncated */
	isTruncated: boolean;
}
