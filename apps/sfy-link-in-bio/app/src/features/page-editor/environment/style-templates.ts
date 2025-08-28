// Based on: https://daisyui.com/theme-generator
export const styleTemplates: TStyleTemplate[] = [
	{
		key: 'light',
		name: 'Light',
		colors: {
			primary: '#7C3AED', // oklch(45% 0.24 277.023) - for buttons/accents only
			secondary: '#F3F4F6', // oklch(95% 0 0) - base-200 for subtle surfaces
			surface: '#FFFFFF', // oklch(100% 0 0) - base-100 for cards
			background: '#FAFAFA', // oklch(98% 0 0) - base-200 for page background
			text: '#1F2937' // base-content for readable text
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 400,
			fontSize: 16
		},
		spacing: {
			borderRadius: 8, // --radius-box: 0.5rem
			padding: 16,
			gap: 8
		}
	},
	{
		key: 'dark',
		name: 'Dark',
		colors: {
			primary: '#8B5CF6', // oklch(58% 0.233 277.117) - for buttons/accents only
			secondary: '#374151', // oklch(21.15% 0.012 254.09) - base-300 for borders
			surface: '#1F2937', // oklch(23.26% 0.014 253.1) - base-200 for cards
			background: '#111827', // oklch(25.33% 0.016 252.42) - base-100 page background
			text: '#F9FAFB' // base-content for readable text
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 500,
			fontSize: 16
		},
		spacing: {
			borderRadius: 8,
			padding: 16,
			gap: 8
		}
	},
	{
		key: 'cupcake',
		name: 'Cupcake',
		colors: {
			primary: '#65C3C8', // oklch(85% 0.138 181.071) - for buttons/accents
			secondary: '#F7D7D7', // oklch(89% 0.061 343.231) - secondary surfaces
			surface: '#FAF7F5', // oklch(97.788% 0.004 56.375) - card backgrounds
			background: '#F2F2F2', // oklch(93.982% 0.007 61.449) - page background
			text: '#3D2E3A' // base-content for readable text
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 400,
			fontSize: 16
		},
		spacing: {
			borderRadius: 16, // --radius-box: 1rem
			padding: 20,
			gap: 12
		}
	},
	{
		key: 'bumblebee',
		name: 'Bumblebee',
		colors: {
			primary: '#F59E0B', // oklch(85% 0.199 91.936) - for buttons/accents
			secondary: '#FEF3C7', // oklch(75% 0.183 55.934) - secondary surfaces
			surface: '#FFFFFF', // oklch(100% 0 0) - card backgrounds
			background: '#F7F7F7', // oklch(97% 0 0) - page background
			text: '#1F2937' // base-content for readable text
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 500,
			fontSize: 16
		},
		spacing: {
			borderRadius: 16,
			padding: 20,
			gap: 12
		}
	},
	{
		key: 'emerald',
		name: 'Emerald',
		colors: {
			primary: '#10B981', // oklch(76.662% 0.135 153.45) - for buttons/accents
			secondary: '#6366F1', // oklch(61.302% 0.202 261.294) - secondary accent
			surface: '#FFFFFF', // oklch(100% 0 0) - card backgrounds
			background: '#F7F7F7', // oklch(93% 0 0) - page background
			text: '#1F2937' // base-content for readable text
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 400,
			fontSize: 16
		},
		spacing: {
			borderRadius: 16,
			padding: 18,
			gap: 10
		}
	},
	{
		key: 'corporate',
		name: 'Corporate',
		colors: {
			primary: '#3B82F6', // oklch(58% 0.158 241.966) - for buttons/accents
			secondary: '#6B7280', // oklch(55% 0.046 257.417) - neutral gray
			surface: '#FFFFFF', // oklch(100% 0 0) - card backgrounds
			background: '#F7F7F7', // oklch(93% 0 0) - page background
			text: '#1F2937' // base-content for readable text
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 500,
			fontSize: 15
		},
		spacing: {
			borderRadius: 4, // --radius-box: 0.25rem
			padding: 16,
			gap: 8
		}
	},
	{
		key: 'synthwave',
		name: 'Synthwave',
		colors: {
			primary: '#F472B6', // oklch(71% 0.202 349.761) - for buttons/accents
			secondary: '#60A5FA', // oklch(82% 0.111 230.318) - secondary accent
			surface: '#1E1B2E', // oklch(20% 0.09 281.288) - card backgrounds
			background: '#0F0B1A', // oklch(15% 0.09 281.288) - page background
			text: '#E5E7EB' // base-content for readable text on dark
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 600,
			fontSize: 16
		},
		spacing: {
			borderRadius: 16,
			padding: 20,
			gap: 12
		}
	},
	{
		key: 'retro',
		name: 'Retro',
		colors: {
			primary: '#F59E0B', // oklch(80% 0.114 19.571) - for buttons/accents
			secondary: '#34D399', // oklch(92% 0.084 155.995) - secondary accent
			surface: '#F5F5DC', // oklch(91.637% 0.034 90.515) - card backgrounds
			background: '#E5E5C7', // oklch(88.272% 0.049 91.774) - page background
			text: '#2D1B0E' // base-content for readable text
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 400,
			fontSize: 15
		},
		spacing: {
			borderRadius: 8,
			padding: 18,
			gap: 10
		}
	}
];

export interface TStyleTemplate {
	key: string;
	name: string;
	colors: {
		primary: string;
		secondary: string;
		surface: string;
		background: string;
		text: string;
	};
	typography: {
		fontFamily: string;
		fontWeight: number;
		fontSize: number;
	};
	spacing: {
		borderRadius: number;
		padding: number;
		gap: number;
	};
}
