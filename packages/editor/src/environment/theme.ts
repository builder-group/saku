import { hexToPaint } from '../lib';
import { TPaint, TSolidPaint } from '../types';

export const themeMetadata = {
	size: {
		text: {
			'sm': 14,
			'base': 16,
			'lg': 18,
			'xl': 20,
			'2xl': 24,
			// step: 0.125
			'get': (step = 0) => 1 + step * 0.125
		},
		box: {
			xs: 4,
			sm: 6,
			base: 8,
			lg: 12,
			xl: 16,
			// step: 0.25
			get: (step = 0) => 1 + step * 0.25
		}
	}
} as const;

// Inspired by: https://daisyui.com/theme-generator
export const themes: TTheme[] = [
	{
		key: 'light',
		name: 'Light',
		paint: {
			base100: hexToPaint('#ffffff'),
			base100Content: hexToPaint('#1e293b'),
			base200: hexToPaint('#f8fafc'),
			base200Content: hexToPaint('#1e293b'),
			base300: hexToPaint('#e2e8f0'),
			base300Content: hexToPaint('#1e293b'),
			primary: hexToPaint('#3b82f6'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#8b5cf6'),
			secondaryContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#64748b'),
			neutralContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#e2e8f0'),
			accentContent: hexToPaint('#475569'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#10b981'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#f59e0b'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#ef4444'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 12, field: 8, selector: 6 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'dark',
		name: 'Dark',
		paint: {
			base100: hexToPaint('#0f172a'),
			base100Content: hexToPaint('#f1f5f9'),
			base200: hexToPaint('#1e293b'),
			base200Content: hexToPaint('#f1f5f9'),
			base300: hexToPaint('#334155'),
			base300Content: hexToPaint('#f1f5f9'),
			primary: hexToPaint('#6366f1'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#a855f7'),
			secondaryContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#94a3b8'),
			neutralContent: hexToPaint('#0f172a'),
			accent: hexToPaint('#334155'),
			accentContent: hexToPaint('#cbd5e1'),
			info: hexToPaint('#06b6d4'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 12, field: 8, selector: 6 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'cupcake',
		name: 'Cupcake',
		paint: {
			base100: hexToPaint('#fef7f5'),
			base100Content: hexToPaint('#581c87'),
			base200: hexToPaint('#fdf2f8'),
			base200Content: hexToPaint('#581c87'),
			base300: hexToPaint('#fce7f3'),
			base300Content: hexToPaint('#581c87'),
			primary: hexToPaint('#ec4899'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#f59e0b'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#fbbf24'),
			accentContent: hexToPaint('#92400e'),
			neutral: hexToPaint('#581c87'),
			neutralContent: hexToPaint('#fdf2f8'),
			info: hexToPaint('#06b6d4'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#10b981'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#f59e0b'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#ef4444'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Poppins', fontWeight: 700 },
			text: { fontFamily: 'Open Sans', fontWeight: 400 }
		},
		radius: { box: 20, field: 16, selector: 12 },
		effects: {
			stroke: { width: 3 },
			shadow: {
				blur: 20,
				offsetX: 0,
				offsetY: 10,
				spread: 0
			}
		}
	},
	{
		key: 'bumblebee',
		name: 'Bumblebee',
		paint: {
			base100: hexToPaint('#fefce8'),
			base100Content: hexToPaint('#451a03'),
			base200: hexToPaint('#fef3c7'),
			base200Content: hexToPaint('#451a03'),
			base300: hexToPaint('#fde68a'),
			base300Content: hexToPaint('#451a03'),
			primary: hexToPaint('#d97706'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#fbbf24'),
			secondaryContent: hexToPaint('#451a03'),
			accent: hexToPaint('#f59e0b'),
			accentContent: hexToPaint('#451a03'),
			neutral: hexToPaint('#451a03'),
			neutralContent: hexToPaint('#fefce8'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Montserrat', fontWeight: 700 },
			text: { fontFamily: 'Lato', fontWeight: 400 }
		},
		radius: { box: 16, field: 12, selector: 8 },
		effects: {
			stroke: { width: 3 },
			shadow: {
				blur: 16,
				offsetX: 0,
				offsetY: 8,
				spread: 0
			}
		}
	},
	{
		key: 'emerald',
		name: 'Emerald',
		paint: {
			base100: hexToPaint('#f0fdf4'),
			base100Content: hexToPaint('#14532d'),
			base200: hexToPaint('#dcfce7'),
			base200Content: hexToPaint('#14532d'),
			base300: hexToPaint('#bbf7d0'),
			base300Content: hexToPaint('#14532d'),
			primary: hexToPaint('#059669'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#10b981'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#34d399'),
			accentContent: hexToPaint('#064e3b'),
			neutral: hexToPaint('#14532d'),
			neutralContent: hexToPaint('#f0fdf4'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Karla', fontWeight: 700 },
			text: { fontFamily: 'Karla', fontWeight: 400 }
		},
		radius: { box: 16, field: 12, selector: 8 },
		effects: {
			stroke: { width: 2 }
		}
	},
	{
		key: 'corporate',
		name: 'Corporate',
		paint: {
			base100: hexToPaint('#ffffff'),
			base100Content: hexToPaint('#1e293b'),
			base200: hexToPaint('#f8fafc'),
			base200Content: hexToPaint('#1e293b'),
			base300: hexToPaint('#e2e8f0'),
			base300Content: hexToPaint('#1e293b'),
			primary: hexToPaint('#1e40af'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#475569'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#64748b'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#1e293b'),
			neutralContent: hexToPaint('#ffffff'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Roboto', fontWeight: 700 },
			text: { fontFamily: 'Roboto', fontWeight: 400 }
		},
		radius: { box: 8, field: 6, selector: 4 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 6,
				offsetX: 0,
				offsetY: 2,
				spread: 0
			}
		}
	},
	{
		key: 'synthwave',
		name: 'Synthwave',
		paint: {
			base100: hexToPaint('#2d1b69'),
			base100Content: hexToPaint('#ffffff'),
			base200: hexToPaint('#1a103d'),
			base200Content: hexToPaint('#ffffff'),
			base300: hexToPaint('#0f0a23'),
			base300Content: hexToPaint('#ffffff'),
			primary: hexToPaint('#e779c1'),
			primaryContent: hexToPaint('#2d1b69'),
			secondary: hexToPaint('#58c7f3'),
			secondaryContent: hexToPaint('#2d1b69'),
			accent: hexToPaint('#f3cc30'),
			accentContent: hexToPaint('#2d1b69'),
			neutral: hexToPaint('#ffffff'),
			neutralContent: hexToPaint('#2d1b69'),
			info: hexToPaint('#3abff8'),
			infoContent: hexToPaint('#2d1b69'),
			success: hexToPaint('#36d399'),
			successContent: hexToPaint('#2d1b69'),
			warning: hexToPaint('#fbbd23'),
			warningContent: hexToPaint('#2d1b69'),
			error: hexToPaint('#f87272'),
			errorContent: hexToPaint('#2d1b69')
		},
		typography: {
			heading: { fontFamily: 'B612', fontWeight: 700 },
			text: { fontFamily: 'B612', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(0),
			box: themeMetadata.size.box.get(-1)
		},
		radius: { box: 4, field: 2, selector: 2 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 20,
				offsetX: 0,
				offsetY: 0,
				spread: 0
			}
		}
	},
	{
		key: 'retro',
		name: 'Retro',
		paint: {
			base100: hexToPaint('#e4d8b4'),
			base100Content: hexToPaint('#2d1b69'),
			base200: hexToPaint('#d4c494'),
			base200Content: hexToPaint('#2d1b69'),
			base300: hexToPaint('#c4b074'),
			base300Content: hexToPaint('#2d1b69'),
			primary: hexToPaint('#ef9995'),
			primaryContent: hexToPaint('#2d1b69'),
			secondary: hexToPaint('#a991f7'),
			secondaryContent: hexToPaint('#2d1b69'),
			accent: hexToPaint('#dc8850'),
			accentContent: hexToPaint('#2d1b69'),
			neutral: hexToPaint('#2d1b69'),
			neutralContent: hexToPaint('#e4d8b4'),
			info: hexToPaint('#3abff8'),
			infoContent: hexToPaint('#2d1b69'),
			success: hexToPaint('#36d399'),
			successContent: hexToPaint('#2d1b69'),
			warning: hexToPaint('#fbbd23'),
			warningContent: hexToPaint('#2d1b69'),
			error: hexToPaint('#f87272'),
			errorContent: hexToPaint('#2d1b69')
		},
		typography: {
			heading: { fontFamily: 'Playfair Display', fontWeight: 700 },
			text: { fontFamily: 'Lora', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(2),
			box: themeMetadata.size.box.get(2)
		},
		radius: { box: 0, field: 0, selector: 0 },
		effects: {
			stroke: { width: 4 },
			shadow: {
				blur: 0,
				offsetX: 4,
				offsetY: 4,
				spread: 0
			}
		}
	},
	{
		key: 'cyberpunk',
		name: 'Cyberpunk',
		paint: {
			base100: hexToPaint('#FFFF00'),
			base100Content: hexToPaint('#000000'),
			base200: hexToPaint('#FFFF33'),
			base200Content: hexToPaint('#000000'),
			base300: hexToPaint('#FFFF66'),
			base300Content: hexToPaint('#000000'),
			primary: hexToPaint('#FF0066'),
			primaryContent: hexToPaint('#000000'),
			secondary: hexToPaint('#00FFFF'),
			secondaryContent: hexToPaint('#000000'),
			accent: hexToPaint('#FF00FF'),
			accentContent: hexToPaint('#000000'),
			neutral: hexToPaint('#6600FF'),
			neutralContent: hexToPaint('#FFFF00'),
			info: hexToPaint('#00CCFF'),
			infoContent: hexToPaint('#000000'),
			success: hexToPaint('#00FF66'),
			successContent: hexToPaint('#000000'),
			warning: hexToPaint('#FF6600'),
			warningContent: hexToPaint('#000000'),
			error: hexToPaint('#FF0033'),
			errorContent: hexToPaint('#000000')
		},
		typography: {
			heading: { fontFamily: 'B612', fontWeight: 700 },
			text: { fontFamily: 'B612', fontWeight: 400 }
		},
		radius: { box: 0, field: 0, selector: 0 },
		effects: {
			stroke: { width: 3 },
			shadow: {
				blur: 0,
				offsetX: 8,
				offsetY: 8,
				spread: 0
			}
		}
	},
	{
		key: 'valentine',
		name: 'Valentine',
		paint: {
			base100: hexToPaint('#fef2f2'),
			base100Content: hexToPaint('#7f1d1d'),
			base200: hexToPaint('#fecaca'),
			base200Content: hexToPaint('#7f1d1d'),
			base300: hexToPaint('#fca5a5'),
			base300Content: hexToPaint('#7f1d1d'),
			primary: hexToPaint('#dc2626'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#f472b6'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#ec4899'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#7f1d1d'),
			neutralContent: hexToPaint('#fef2f2'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Playfair Display', fontWeight: 700 },
			text: { fontFamily: 'Lora', fontWeight: 400 }
		},
		radius: { box: 20, field: 16, selector: 12 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 20,
				offsetX: 0,
				offsetY: 10,
				spread: 0
			}
		}
	},
	{
		key: 'halloween',
		name: 'Halloween',
		paint: {
			base100: hexToPaint('#1f2937'),
			base100Content: hexToPaint('#fbbf24'),
			base200: hexToPaint('#374151'),
			base200Content: hexToPaint('#fbbf24'),
			base300: hexToPaint('#4b5563'),
			base300Content: hexToPaint('#fbbf24'),
			primary: hexToPaint('#f59e0b'),
			primaryContent: hexToPaint('#1f2937'),
			secondary: hexToPaint('#dc2626'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#7c3aed'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#fbbf24'),
			neutralContent: hexToPaint('#1f2937'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#f59e0b'),
			warningContent: hexToPaint('#1f2937'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'BioRhyme', fontWeight: 700 },
			text: { fontFamily: 'BioRhyme', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(1),
			box: themeMetadata.size.box.get(0)
		},
		radius: { box: 12, field: 8, selector: 6 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 20,
				offsetX: 0,
				offsetY: 8,
				spread: 0
			}
		}
	},
	{
		key: 'garden',
		name: 'Garden',
		paint: {
			base100: hexToPaint('#f0fdf4'),
			base100Content: hexToPaint('#14532d'),
			base200: hexToPaint('#dcfce7'),
			base200Content: hexToPaint('#14532d'),
			base300: hexToPaint('#bbf7d0'),
			base300Content: hexToPaint('#14532d'),
			primary: hexToPaint('#059669'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#f59e0b'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#10b981'),
			accentContent: hexToPaint('#064e3b'),
			neutral: hexToPaint('#14532d'),
			neutralContent: hexToPaint('#f0fdf4'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(0),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 20, field: 16, selector: 12 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 12,
				offsetX: 0,
				offsetY: 6,
				spread: 0
			}
		}
	},
	{
		key: 'forest',
		name: 'Forest',
		paint: {
			base100: hexToPaint('#0f172a'),
			base100Content: hexToPaint('#f0fdf4'),
			base200: hexToPaint('#1e293b'),
			base200Content: hexToPaint('#f0fdf4'),
			base300: hexToPaint('#334155'),
			base300Content: hexToPaint('#f0fdf4'),
			primary: hexToPaint('#059669'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#10b981'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#34d399'),
			accentContent: hexToPaint('#064e3b'),
			neutral: hexToPaint('#f0fdf4'),
			neutralContent: hexToPaint('#0f172a'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(1),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 16, field: 12, selector: 8 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 16,
				offsetX: 0,
				offsetY: 8,
				spread: 0
			}
		}
	},
	{
		key: 'aqua',
		name: 'Aqua',
		paint: {
			base100: hexToPaint('#f0f9ff'),
			base100Content: hexToPaint('#0c4a6e'),
			base200: hexToPaint('#e0f2fe'),
			base200Content: hexToPaint('#0c4a6e'),
			base300: hexToPaint('#bae6fd'),
			base300Content: hexToPaint('#0c4a6e'),
			primary: hexToPaint('#0284c7'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#06b6d4'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#0891b2'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#0c4a6e'),
			neutralContent: hexToPaint('#f0f9ff'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(0),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 16, field: 12, selector: 8 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 12,
				offsetX: 0,
				offsetY: 6,
				spread: 0
			}
		}
	},
	{
		key: 'lofi',
		name: 'Lo-Fi',
		paint: {
			base100: hexToPaint('#ffffff'),
			base100Content: hexToPaint('#000000'),
			base200: hexToPaint('#f7f7f7'),
			base200Content: hexToPaint('#000000'),
			base300: hexToPaint('#e3e3e3'),
			base300Content: hexToPaint('#000000'),
			primary: hexToPaint('#000000'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#7f7f7f'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#7f7f7f'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#000000'),
			neutralContent: hexToPaint('#ffffff'),
			info: hexToPaint('#000000'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#000000'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#000000'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#000000'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Cairo', fontWeight: 700 },
			text: { fontFamily: 'Cairo', fontWeight: 400 }
		},
		radius: { box: 0, field: 0, selector: 0 },
		effects: {
			stroke: { width: 2 }
		}
	},
	{
		key: 'pastel',
		name: 'Pastel',
		paint: {
			base100: hexToPaint('#ffffff'),
			base100Content: hexToPaint('#374151'),
			base200: hexToPaint('#fafafa'),
			base200Content: hexToPaint('#374151'),
			base300: hexToPaint('#f5f5f5'),
			base300Content: hexToPaint('#374151'),
			primary: hexToPaint('#f3e8ff'),
			primaryContent: hexToPaint('#581c87'),
			secondary: hexToPaint('#fef3c7'),
			secondaryContent: hexToPaint('#92400e'),
			accent: hexToPaint('#dbeafe'),
			accentContent: hexToPaint('#1e40af'),
			neutral: hexToPaint('#374151'),
			neutralContent: hexToPaint('#ffffff'),
			info: hexToPaint('#e0f2fe'),
			infoContent: hexToPaint('#0c4a6e'),
			success: hexToPaint('#dcfce7'),
			successContent: hexToPaint('#14532d'),
			warning: hexToPaint('#fef3c7'),
			warningContent: hexToPaint('#92400e'),
			error: hexToPaint('#fee2e2'),
			errorContent: hexToPaint('#7f1d1d')
		},
		typography: {
			heading: { fontFamily: 'Mulish', fontWeight: 700 },
			text: { fontFamily: 'Mulish', fontWeight: 400 }
		},
		radius: { box: 20, field: 16, selector: 12 },
		effects: {
			stroke: { width: 2 }
		}
	},
	{
		key: 'fantasy',
		name: 'Fantasy',
		paint: {
			base100: hexToPaint('#ffffff'),
			base100Content: hexToPaint('#1e1b4b'),
			base200: hexToPaint('#f8f8ff'),
			base200Content: hexToPaint('#1e1b4b'),
			base300: hexToPaint('#f0f0ff'),
			base300Content: hexToPaint('#1e1b4b'),
			primary: hexToPaint('#7c3aed'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#ec4899'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#a855f7'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#1e1b4b'),
			neutralContent: hexToPaint('#ffffff'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Vollkorn', fontWeight: 700 },
			text: { fontFamily: 'Vollkorn', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(1),
			box: themeMetadata.size.box.get(0)
		},
		radius: { box: 24, field: 20, selector: 16 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 20,
				offsetX: 0,
				offsetY: 10,
				spread: 0
			}
		}
	},
	{
		key: 'wireframe',
		name: 'Wireframe',
		paint: {
			base100: hexToPaint('#ffffff'),
			base100Content: hexToPaint('#000000'),
			base200: hexToPaint('#f8f8f8'),
			base200Content: hexToPaint('#000000'),
			base300: hexToPaint('#f0f0f0'),
			base300Content: hexToPaint('#000000'),
			primary: hexToPaint('#000000'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#000000'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#000000'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#000000'),
			neutralContent: hexToPaint('#ffffff'),
			info: hexToPaint('#000000'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#000000'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#000000'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#000000'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'system-ui', fontWeight: 700 },
			text: { fontFamily: 'system-ui', fontWeight: 400 }
		},
		radius: { box: 0, field: 0, selector: 0 },
		effects: {
			stroke: { width: 5 },
			shadow: {
				blur: 0,
				offsetX: 0,
				offsetY: 0,
				spread: 6
			}
		}
	},
	{
		key: 'black',
		name: 'Black',
		paint: {
			base100: hexToPaint('#000000'),
			base100Content: hexToPaint('#ffffff'),
			base200: hexToPaint('#1a1a1a'),
			base200Content: hexToPaint('#ffffff'),
			base300: hexToPaint('#333333'),
			base300Content: hexToPaint('#ffffff'),
			primary: hexToPaint('#ffffff'),
			primaryContent: hexToPaint('#000000'),
			secondary: hexToPaint('#ffffff'),
			secondaryContent: hexToPaint('#000000'),
			accent: hexToPaint('#ffffff'),
			accentContent: hexToPaint('#000000'),
			neutral: hexToPaint('#ffffff'),
			neutralContent: hexToPaint('#000000'),
			info: hexToPaint('#ffffff'),
			infoContent: hexToPaint('#000000'),
			success: hexToPaint('#ffffff'),
			successContent: hexToPaint('#000000'),
			warning: hexToPaint('#ffffff'),
			warningContent: hexToPaint('#000000'),
			error: hexToPaint('#ffffff'),
			errorContent: hexToPaint('#000000')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 6, selector: 4 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 0,
				offsetX: 0,
				offsetY: 0,
				spread: 0
			}
		}
	},
	{
		key: 'luxury',
		name: 'Luxury',
		paint: {
			base100: hexToPaint('#ffffff'),
			base100Content: hexToPaint('#1f2937'),
			base200: hexToPaint('#f8f8f8'),
			base200Content: hexToPaint('#1f2937'),
			base300: hexToPaint('#f0f0f0'),
			base300Content: hexToPaint('#1f2937'),
			primary: hexToPaint('#000000'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#1f2937'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#1f2937'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#1f2937'),
			neutralContent: hexToPaint('#ffffff'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Playfair Display', fontWeight: 700 },
			text: { fontFamily: 'Lora', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(-1),
			box: themeMetadata.size.box.get(-1)
		},
		radius: { box: 8, field: 6, selector: 4 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 12,
				offsetX: 0,
				offsetY: 4,
				spread: 2
			}
		}
	},
	{
		key: 'dracula',
		name: 'Dracula',
		paint: {
			base100: hexToPaint('#282a36'),
			base100Content: hexToPaint('#f8f8f2'),
			base200: hexToPaint('#44475a'),
			base200Content: hexToPaint('#f8f8f2'),
			base300: hexToPaint('#6272a4'),
			base300Content: hexToPaint('#f8f8f2'),
			primary: hexToPaint('#bd93f9'),
			primaryContent: hexToPaint('#282a36'),
			secondary: hexToPaint('#ff79c6'),
			secondaryContent: hexToPaint('#282a36'),
			accent: hexToPaint('#ffb86c'),
			accentContent: hexToPaint('#282a36'),
			neutral: hexToPaint('#f8f8f2'),
			neutralContent: hexToPaint('#282a36'),
			info: hexToPaint('#8be9fd'),
			infoContent: hexToPaint('#282a36'),
			success: hexToPaint('#50fa7b'),
			successContent: hexToPaint('#282a36'),
			warning: hexToPaint('#ffb86c'),
			warningContent: hexToPaint('#282a36'),
			error: hexToPaint('#ff5555'),
			errorContent: hexToPaint('#282a36')
		},
		typography: {
			heading: { fontFamily: 'BioRhyme', fontWeight: 700 },
			text: { fontFamily: 'BioRhyme', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(1),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 12, field: 8, selector: 6 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 16,
				offsetX: 0,
				offsetY: 8,
				spread: 0
			}
		}
	},
	{
		key: 'cmyk',
		name: 'CMYK',
		paint: {
			base100: hexToPaint('#ffffff'),
			base100Content: hexToPaint('#1f2937'),
			base200: hexToPaint('#f8f8f8'),
			base200Content: hexToPaint('#1f2937'),
			base300: hexToPaint('#f0f0f0'),
			base300Content: hexToPaint('#1f2937'),
			primary: hexToPaint('#0ea5e9'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#ec4899'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#f59e0b'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#1f2937'),
			neutralContent: hexToPaint('#ffffff'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(-1),
			box: themeMetadata.size.box.get(-1)
		},
		radius: { box: 8, field: 6, selector: 4 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 8,
				offsetX: 0,
				offsetY: 4,
				spread: 0
			}
		}
	},
	{
		key: 'autumn',
		name: 'Autumn',
		paint: {
			base100: hexToPaint('#fef7f5'),
			base100Content: hexToPaint('#7c2d12'),
			base200: hexToPaint('#fde8e0'),
			base200Content: hexToPaint('#7c2d12'),
			base300: hexToPaint('#fcd5c5'),
			base300Content: hexToPaint('#7c2d12'),
			primary: hexToPaint('#ea580c'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#dc2626'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#f59e0b'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#7c2d12'),
			neutralContent: hexToPaint('#fef7f5'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(1),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 16, field: 12, selector: 8 },
		effects: {
			stroke: { width: 2 }
		}
	},
	{
		key: 'business',
		name: 'Business',
		paint: {
			base100: hexToPaint('#ffffff'),
			base100Content: hexToPaint('#1e293b'),
			base200: hexToPaint('#f8fafc'),
			base200Content: hexToPaint('#1e293b'),
			base300: hexToPaint('#e2e8f0'),
			base300Content: hexToPaint('#1e293b'),
			primary: hexToPaint('#1e40af'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#475569'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#64748b'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#1e293b'),
			neutralContent: hexToPaint('#ffffff'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 6, field: 4, selector: 2 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 4,
				offsetX: 0,
				offsetY: 2,
				spread: 0
			}
		}
	},
	{
		key: 'acid',
		name: 'Acid',
		paint: {
			base100: hexToPaint('#000000'),
			base100Content: hexToPaint('#00ff00'),
			base200: hexToPaint('#1a1a1a'),
			base200Content: hexToPaint('#00ff00'),
			base300: hexToPaint('#333333'),
			base300Content: hexToPaint('#00ff00'),
			primary: hexToPaint('#00ff00'),
			primaryContent: hexToPaint('#000000'),
			secondary: hexToPaint('#ff00ff'),
			secondaryContent: hexToPaint('#000000'),
			accent: hexToPaint('#ffff00'),
			accentContent: hexToPaint('#000000'),
			neutral: hexToPaint('#00ff00'),
			neutralContent: hexToPaint('#000000'),
			info: hexToPaint('#00ffff'),
			infoContent: hexToPaint('#000000'),
			success: hexToPaint('#00ff00'),
			successContent: hexToPaint('#000000'),
			warning: hexToPaint('#ffff00'),
			warningContent: hexToPaint('#000000'),
			error: hexToPaint('#ff0000'),
			errorContent: hexToPaint('#000000')
		},
		typography: {
			heading: { fontFamily: 'B612', fontWeight: 700 },
			text: { fontFamily: 'B612', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(0),
			box: themeMetadata.size.box.get(-1)
		},
		radius: { box: 0, field: 0, selector: 0 },
		effects: {
			stroke: { width: 2 }
		}
	},
	{
		key: 'lemonade',
		name: 'Lemonade',
		paint: {
			base100: hexToPaint('#fefce8'),
			base100Content: hexToPaint('#451a03'),
			base200: hexToPaint('#fef3c7'),
			base200Content: hexToPaint('#451a03'),
			base300: hexToPaint('#fde68a'),
			base300Content: hexToPaint('#451a03'),
			primary: hexToPaint('#65a30d'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#fbbf24'),
			secondaryContent: hexToPaint('#451a03'),
			accent: hexToPaint('#f59e0b'),
			accentContent: hexToPaint('#451a03'),
			neutral: hexToPaint('#451a03'),
			neutralContent: hexToPaint('#fefce8'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(1),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 20, field: 16, selector: 12 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 16,
				offsetX: 0,
				offsetY: 8,
				spread: 0
			}
		}
	},
	{
		key: 'night',
		name: 'Night',
		paint: {
			base100: hexToPaint('#0f172a'),
			base100Content: hexToPaint('#f1f5f9'),
			base200: hexToPaint('#1e293b'),
			base200Content: hexToPaint('#f1f5f9'),
			base300: hexToPaint('#334155'),
			base300Content: hexToPaint('#f1f5f9'),
			primary: hexToPaint('#38bdf8'),
			primaryContent: hexToPaint('#0f172a'),
			secondary: hexToPaint('#818cf8'),
			secondaryContent: hexToPaint('#0f172a'),
			accent: hexToPaint('#f472b6'),
			accentContent: hexToPaint('#0f172a'),
			neutral: hexToPaint('#f1f5f9'),
			neutralContent: hexToPaint('#0f172a'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#0f172a'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#0f172a'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#0f172a'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#0f172a')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(0),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 16, field: 12, selector: 8 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 20,
				offsetX: 0,
				offsetY: 10,
				spread: 0
			}
		}
	},
	{
		key: 'coffee',
		name: 'Coffee',
		paint: {
			base100: hexToPaint('#1a1a1a'),
			base100Content: hexToPaint('#f5f5f4'),
			base200: hexToPaint('#2d2b42'),
			base200Content: hexToPaint('#f5f5f4'),
			base300: hexToPaint('#454960'),
			base300Content: hexToPaint('#f5f5f4'),
			primary: hexToPaint('#db924b'),
			primaryContent: hexToPaint('#1a1a1a'),
			secondary: hexToPaint('#263e3f'),
			secondaryContent: hexToPaint('#f5f5f4'),
			accent: hexToPaint('#f0b323'),
			accentContent: hexToPaint('#1a1a1a'),
			neutral: hexToPaint('#f5f5f4'),
			neutralContent: hexToPaint('#1a1a1a'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#1a1a1a'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#1a1a1a'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#1a1a1a'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#1a1a1a')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(1),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 12, field: 8, selector: 6 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 16,
				offsetX: 0,
				offsetY: 8,
				spread: 0
			}
		}
	},
	{
		key: 'winter',
		name: 'Winter',
		paint: {
			base100: hexToPaint('#f0f9ff'),
			base100Content: hexToPaint('#0c4a6e'),
			base200: hexToPaint('#e0f2fe'),
			base200Content: hexToPaint('#0c4a6e'),
			base300: hexToPaint('#bae6fd'),
			base300Content: hexToPaint('#0c4a6e'),
			primary: hexToPaint('#0284c7'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#6366f1'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#ec4899'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#0c4a6e'),
			neutralContent: hexToPaint('#f0f9ff'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(0),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 16, field: 12, selector: 8 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 12,
				offsetX: 0,
				offsetY: 6,
				spread: 0
			}
		}
	},
	{
		key: 'dim',
		name: 'Dim',
		paint: {
			base100: hexToPaint('#1f2937'),
			base100Content: hexToPaint('#f9fafb'),
			base200: hexToPaint('#374151'),
			base200Content: hexToPaint('#f9fafb'),
			base300: hexToPaint('#4b5563'),
			base300Content: hexToPaint('#f9fafb'),
			primary: hexToPaint('#f59e0b'),
			primaryContent: hexToPaint('#1f2937'),
			secondary: hexToPaint('#ef4444'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#10b981'),
			accentContent: hexToPaint('#1f2937'),
			neutral: hexToPaint('#f9fafb'),
			neutralContent: hexToPaint('#1f2937'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#1f2937'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#1f2937'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#1f2937'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#1f2937')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 12, field: 8, selector: 6 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 8,
				offsetX: 0,
				offsetY: 4,
				spread: 0
			}
		}
	},
	{
		key: 'nord',
		name: 'Nord',
		paint: {
			base100: hexToPaint('#2e3440'),
			base100Content: hexToPaint('#eceff4'),
			base200: hexToPaint('#3b4252'),
			base200Content: hexToPaint('#eceff4'),
			base300: hexToPaint('#434c5e'),
			base300Content: hexToPaint('#eceff4'),
			primary: hexToPaint('#88c0d0'),
			primaryContent: hexToPaint('#2e3440'),
			secondary: hexToPaint('#81a1c1'),
			secondaryContent: hexToPaint('#2e3440'),
			accent: hexToPaint('#8fbcbb'),
			accentContent: hexToPaint('#2e3440'),
			neutral: hexToPaint('#eceff4'),
			neutralContent: hexToPaint('#2e3440'),
			info: hexToPaint('#5e81ac'),
			infoContent: hexToPaint('#2e3440'),
			success: hexToPaint('#a3be8c'),
			successContent: hexToPaint('#2e3440'),
			warning: hexToPaint('#ebcb8b'),
			warningContent: hexToPaint('#2e3440'),
			error: hexToPaint('#bf616a'),
			errorContent: hexToPaint('#2e3440')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 12, field: 8, selector: 6 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 12,
				offsetX: 0,
				offsetY: 6,
				spread: 0
			}
		}
	},
	{
		key: 'sunset',
		name: 'Sunset',
		paint: {
			base100: hexToPaint('#2d1b69'),
			base100Content: hexToPaint('#ffffff'),
			base200: hexToPaint('#1a103d'),
			base200Content: hexToPaint('#ffffff'),
			base300: hexToPaint('#0f0a23'),
			base300Content: hexToPaint('#ffffff'),
			primary: hexToPaint('#f97316'),
			primaryContent: hexToPaint('#ffffff'),
			secondary: hexToPaint('#f59e0b'),
			secondaryContent: hexToPaint('#ffffff'),
			accent: hexToPaint('#ec4899'),
			accentContent: hexToPaint('#ffffff'),
			neutral: hexToPaint('#ffffff'),
			neutralContent: hexToPaint('#2d1b69'),
			info: hexToPaint('#0ea5e9'),
			infoContent: hexToPaint('#ffffff'),
			success: hexToPaint('#059669'),
			successContent: hexToPaint('#ffffff'),
			warning: hexToPaint('#d97706'),
			warningContent: hexToPaint('#ffffff'),
			error: hexToPaint('#dc2626'),
			errorContent: hexToPaint('#ffffff')
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 700 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: themeMetadata.size.text.get(1),
			box: themeMetadata.size.box.get(1)
		},
		radius: { box: 16, field: 12, selector: 8 },
		effects: {
			stroke: { width: 2 },
			shadow: {
				blur: 20,
				offsetX: 0,
				offsetY: 10,
				spread: 0
			}
		}
	}
];

export interface TTheme {
	key: string;
	name: string;
	paint: {
		// base100/base100Content → Secondary surfaces (cards, widgets) for depth
		base100: TPaint;
		base100Content: TSolidPaint;
		// base200/base200Content → Page-level background and text
		base200: TPaint;
		base200Content: TSolidPaint;
		// base300/base300Content → Highlighted or elevated surfaces
		base300: TPaint;
		base300Content: TSolidPaint;
		// primary/primaryContent → Primary buttons and main actions
		primary: TSolidPaint;
		primaryContent: TSolidPaint;
		// secondary/secondaryContent → Badges, and subtle elements
		secondary: TSolidPaint;
		secondaryContent: TSolidPaint;
		// neutral/neutralContent → Secondary buttons, badges, and subtle elements
		neutral: TSolidPaint;
		neutralContent: TSolidPaint;
		// accent/accentContent → Border colors and decorative elements
		accent: TSolidPaint;
		accentContent: TSolidPaint;
		// info/infoContent → Informational messages and notifications
		info: TSolidPaint;
		infoContent: TSolidPaint;
		// success/successContent → Success states and positive feedback
		success: TSolidPaint;
		successContent: TSolidPaint;
		// warning/warningContent → Warning states and caution messages
		warning: TSolidPaint;
		warningContent: TSolidPaint;
		// error/errorContent → Error states and negative feedback
		error: TSolidPaint;
		errorContent: TSolidPaint;
	};
	typography: {
		heading: {
			fontFamily: string;
			fontWeight: 400 | 500 | 600 | 700;
		};
		text: {
			fontFamily: string;
			fontWeight: 300 | 400 | 500;
		};
	};
	gap?: number; // spacing between elements, in px
	size?: {
		text?: number; // text size multiplier (1 = default)
		box?: number; // card, modal, alert, etc. size multiplier (1 = default)
		field?: number; // input, select, tab, etc. size multiplier (1 = default)
		selector?: number; // checkbox, toggle, badge, etc. size multiplier (1 = default)
	};
	radius: {
		box: number; // card, modal, alert, etc. in px
		field: number; // input, select, tab, etc. in px
		selector: number; // checkbox, toggle, badge, etc. in px
	};
	effects?: {
		shadow?: {
			blur: number; // in px
			offsetX: number; // in px
			offsetY: number; // in px
			spread: number; // in px
		};
		stroke?: {
			width: number; // in px
		};
	};
}
