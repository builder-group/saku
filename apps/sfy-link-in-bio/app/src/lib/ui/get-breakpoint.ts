/**
 * Converts px values to Tailwind breakpoint names
 *
 * https://tailwindcss.com/docs/responsive-design
 *
 * @param px - The pixel value (e.g., 640)
 * @returns The Tailwind breakpoint name ('sm', 'md', 'lg', 'xl', '2xl') or 'base' if no match
 */
export function getBreakpoint(px: number): TBreakpoint {
	if (px >= 1536) return '2xl'; // 1536px (96rem)
	if (px >= 1280) return 'xl'; // 1280px (80rem)
	if (px >= 1024) return 'lg'; // 1024px (64rem)
	if (px >= 768) return 'md'; // 768px (48rem)
	if (px >= 640) return 'sm'; // 640px (40rem)
	return 'base';
}

/**
 * Checks if a breakpoint is active (Tailwind-style behavior)
 *
 * @param currentBreakpoint - The current breakpoint
 * @param targetBreakpoint - The breakpoint to check for
 * @returns true if the target breakpoint is active or smaller
 *
 * @example
 * isBreakpointActive('lg', 'md') // true (lg includes md)
 * isBreakpointActive('sm', 'md') // false (sm doesn't include md)
 * isBreakpointActive('md', 'md') // true (exact match)
 */
export function isBreakpointActive(
	currentBreakpoint: TBreakpoint,
	targetBreakpoint: TBreakpoint
): boolean {
	const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
	const targetIndex = breakpointOrder.indexOf(targetBreakpoint);
	return currentIndex >= targetIndex;
}

const breakpointOrder: TBreakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];

export type TBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'base';
