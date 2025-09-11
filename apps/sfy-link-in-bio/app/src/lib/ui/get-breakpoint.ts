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

type TBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'base';
