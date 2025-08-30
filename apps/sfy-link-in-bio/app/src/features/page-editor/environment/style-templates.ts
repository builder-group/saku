// Based on: https://daisyui.com/theme-generator
export const styleTemplates: TStyleTemplate[] = [
	{
		key: 'light',
		name: 'Light',
		colors: {
			primary: '#7C3AED',
			secondary: '#F3F4F6',
			surface: '#FFFFFF',
			background: '#FAFAFA',
			text: '#1F2937'
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 400,
			fontSize: 16
		},
		spacing: {
			borderRadius: 8,
			padding: 16,
			gap: 8
		}
	},
	{
		key: 'dark',
		name: 'Dark',
		colors: {
			primary: '#8B5CF6',
			secondary: '#374151',
			surface: '#1F2937',
			background: '#111827',
			text: '#F9FAFB'
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
			primary: '#65C3C8',
			secondary: '#F7D7D7',
			surface: '#FAF7F5',
			background: '#F2F2F2',
			text: '#3D2E3A'
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 400,
			fontSize: 16
		},
		spacing: {
			borderRadius: 16,
			padding: 20,
			gap: 12
		}
	},
	{
		key: 'bumblebee',
		name: 'Bumblebee',
		colors: {
			primary: '#F59E0B',
			secondary: '#FEF3C7',
			surface: '#FFFFFF',
			background: '#F7F7F7',
			text: '#1F2937'
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
			primary: '#10B981',
			secondary: '#6366F1',
			surface: '#FFFFFF',
			background: '#F7F7F7',
			text: '#1F2937'
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
			primary: '#3B82F6',
			secondary: '#6B7280',
			surface: '#FFFFFF',
			background: '#F7F7F7',
			text: '#1F2937'
		},
		typography: {
			fontFamily: 'Inter',
			fontWeight: 500,
			fontSize: 15
		},
		spacing: {
			borderRadius: 4,
			padding: 16,
			gap: 8
		}
	},
	{
		key: 'synthwave',
		name: 'Synthwave',
		colors: {
			primary: '#F472B6',
			secondary: '#60A5FA',
			surface: '#1E1B2E',
			background: '#0F0B1A',
			text: '#E5E7EB'
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
			primary: '#F59E0B',
			secondary: '#34D399',
			surface: '#F5F5DC',
			background: '#E5E5C7',
			text: '#2D1B0E'
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
