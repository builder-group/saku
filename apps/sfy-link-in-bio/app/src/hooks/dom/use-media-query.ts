import React from 'react';

export function useMediaQuery(query: string, options: TMediaQueryOptions = {}): boolean {
	const { defaultValue = false } = options;

	const subscribe = React.useCallback(
		(callback: (event: MediaQueryListEvent) => void) => {
			const matchMedia = window.matchMedia(query);
			matchMedia.addEventListener('change', callback);
			return () => {
				matchMedia.removeEventListener('change', callback);
			};
		},
		[query]
	);

	// Get the current value on the client
	const getSnapshot = React.useCallback(() => {
		if (typeof window === 'undefined') {
			return defaultValue;
		}
		return window.matchMedia(query).matches;
	}, [query, defaultValue]);

	// Get the value during SSR
	const getServerSnapshot = React.useCallback(() => {
		return defaultValue;
	}, [defaultValue]);

	return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface TMediaQueryOptions {
	defaultValue?: boolean;
}

// =========================================================================
// Media Query Building Blocks
// =========================================================================

export const mq = {
	// Breakpoints (in rem)
	// https://tailwindcss.com/docs/responsive-design
	'sm': '40',
	'md': '48',
	'lg': '64',
	'xl': '80',
	'2xl': '96',

	// Basic media features
	'min': (size: string) => `(min-width: ${size}rem)`,
	'max': (size: string) => `(max-width: ${size}rem)`,
	'height': (size: string) => `(height: ${size})`,
	'orientation': (value: 'portrait' | 'landscape') => `(orientation: ${value})`,
	'aspect': (ratio: string) => `(aspect-ratio: ${ratio})`,
	'resolution': (dpi: string) => `(resolution: ${dpi})`,
	'and': (...queries: (string | false | undefined | null)[]) =>
		queries.filter(Boolean).join(' and '),

	// Device preferences
	'dark': '(prefers-color-scheme: dark)',
	'light': '(prefers-color-scheme: light)',
	'reduced': '(prefers-reduced-motion: reduce)',

	// Common device features
	'hover': '(hover: hover)',
	'touch': '(hover: none) and (pointer: coarse)',
	'retina': '(-webkit-min-device-pixel-ratio: 2)'
} as const;

/**
 * Composes media queries similar to cn utility
 * @example
 * const query = mqn(
 *   mq.min(mq.md),          // Base: tablet and up
 *   mq.orientation('landscape'),  // Must be landscape
 *   mq.hover,               // Must support hover
 * );
 */
export function mqn(...queries: (string | false | undefined | null)[]): string {
	return queries.filter(Boolean).join(' and ');
}
