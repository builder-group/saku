import { hexToRgba, TRgba } from '../lib';

export const themeMetadata = {
	size: {
		text: {
			xs: 12,
			sm: 14,
			md: 16,
			lg: 18,
			xl: 20,
			// step: 0.125
			get: (step = 0) => 1 + step * 0.125
		},
		box: {
			xs: 2,
			sm: 4,
			md: 6,
			lg: 8,
			xl: 12,
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
		color: {
			base100: hexToRgba('#ffffff'),
			base100Content: hexToRgba('#1e293b'),
			base200: hexToRgba('#f8fafc'),
			base200Content: hexToRgba('#1e293b'),
			primary: hexToRgba('#3b82f6'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#8b5cf6'),
			// secondaryContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#64748b'),
			neutralContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#e2e8f0'),
			accentContent: hexToRgba('#475569'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#10b981'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#f59e0b'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#ef4444'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#0f172a'),
			base100Content: hexToRgba('#f1f5f9'),
			base200: hexToRgba('#1e293b'),
			base200Content: hexToRgba('#f1f5f9'),
			primary: hexToRgba('#6366f1'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#a855f7'),
			// secondaryContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#94a3b8'),
			neutralContent: hexToRgba('#0f172a'),
			accent: hexToRgba('#334155'),
			accentContent: hexToRgba('#cbd5e1'),
			info: hexToRgba('#06b6d4'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#fef7f5'),
			base100Content: hexToRgba('#581c87'),
			base200: hexToRgba('#fdf2f8'),
			base200Content: hexToRgba('#581c87'),
			primary: hexToRgba('#ec4899'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#f59e0b'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#fbbf24'),
			accentContent: hexToRgba('#92400e'),
			neutral: hexToRgba('#581c87'),
			neutralContent: hexToRgba('#fdf2f8'),
			info: hexToRgba('#06b6d4'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#10b981'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#f59e0b'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#ef4444'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#fefce8'),
			base100Content: hexToRgba('#451a03'),
			base200: hexToRgba('#fef3c7'),
			base200Content: hexToRgba('#451a03'),
			primary: hexToRgba('#d97706'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#fbbf24'),
			// secondaryContent: hexToRgba('#451a03'),
			accent: hexToRgba('#f59e0b'),
			accentContent: hexToRgba('#451a03'),
			neutral: hexToRgba('#451a03'),
			neutralContent: hexToRgba('#fefce8'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#f0fdf4'),
			base100Content: hexToRgba('#14532d'),
			base200: hexToRgba('#dcfce7'),
			base200Content: hexToRgba('#14532d'),
			primary: hexToRgba('#059669'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#10b981'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#34d399'),
			accentContent: hexToRgba('#064e3b'),
			neutral: hexToRgba('#14532d'),
			neutralContent: hexToRgba('#f0fdf4'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#ffffff'),
			base100Content: hexToRgba('#1e293b'),
			base200: hexToRgba('#f8fafc'),
			base200Content: hexToRgba('#1e293b'),
			primary: hexToRgba('#1e40af'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#475569'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#64748b'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#1e293b'),
			neutralContent: hexToRgba('#ffffff'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#2d1b69'),
			base100Content: hexToRgba('#ffffff'),
			base200: hexToRgba('#1a103d'),
			base200Content: hexToRgba('#ffffff'),
			primary: hexToRgba('#e779c1'),
			primaryContent: hexToRgba('#2d1b69'),
			// secondary: hexToRgba('#58c7f3'),
			// secondaryContent: hexToRgba('#2d1b69'),
			accent: hexToRgba('#f3cc30'),
			accentContent: hexToRgba('#2d1b69'),
			neutral: hexToRgba('#ffffff'),
			neutralContent: hexToRgba('#2d1b69'),
			info: hexToRgba('#3abff8'),
			infoContent: hexToRgba('#2d1b69'),
			success: hexToRgba('#36d399'),
			successContent: hexToRgba('#2d1b69'),
			warning: hexToRgba('#fbbd23'),
			warningContent: hexToRgba('#2d1b69'),
			error: hexToRgba('#f87272'),
			errorContent: hexToRgba('#2d1b69')
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
		color: {
			base100: hexToRgba('#e4d8b4'),
			base100Content: hexToRgba('#2d1b69'),
			base200: hexToRgba('#d4c494'),
			base200Content: hexToRgba('#2d1b69'),
			primary: hexToRgba('#ef9995'),
			primaryContent: hexToRgba('#2d1b69'),
			// secondary: hexToRgba('#a991f7'),
			// secondaryContent: hexToRgba('#2d1b69'),
			accent: hexToRgba('#dc8850'),
			accentContent: hexToRgba('#2d1b69'),
			neutral: hexToRgba('#2d1b69'),
			neutralContent: hexToRgba('#e4d8b4'),
			info: hexToRgba('#3abff8'),
			infoContent: hexToRgba('#2d1b69'),
			success: hexToRgba('#36d399'),
			successContent: hexToRgba('#2d1b69'),
			warning: hexToRgba('#fbbd23'),
			warningContent: hexToRgba('#2d1b69'),
			error: hexToRgba('#f87272'),
			errorContent: hexToRgba('#2d1b69')
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
		color: {
			base100: hexToRgba('#FFFF00'),
			base100Content: hexToRgba('#000000'),
			base200: hexToRgba('#FFFF33'),
			base200Content: hexToRgba('#000000'),
			primary: hexToRgba('#FF0066'),
			primaryContent: hexToRgba('#000000'),
			// secondary: hexToRgba('#00FFFF'),
			// secondaryContent: hexToRgba('#000000'),
			accent: hexToRgba('#FF00FF'),
			accentContent: hexToRgba('#000000'),
			neutral: hexToRgba('#6600FF'),
			neutralContent: hexToRgba('#FFFF00'),
			info: hexToRgba('#00CCFF'),
			infoContent: hexToRgba('#000000'),
			success: hexToRgba('#00FF66'),
			successContent: hexToRgba('#000000'),
			warning: hexToRgba('#FF6600'),
			warningContent: hexToRgba('#000000'),
			error: hexToRgba('#FF0033'),
			errorContent: hexToRgba('#000000')
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
		color: {
			base100: hexToRgba('#fef2f2'),
			base100Content: hexToRgba('#7f1d1d'),
			base200: hexToRgba('#fecaca'),
			base200Content: hexToRgba('#7f1d1d'),
			primary: hexToRgba('#dc2626'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#f472b6'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#ec4899'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#7f1d1d'),
			neutralContent: hexToRgba('#fef2f2'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#1f2937'),
			base100Content: hexToRgba('#fbbf24'),
			base200: hexToRgba('#374151'),
			base200Content: hexToRgba('#fbbf24'),
			primary: hexToRgba('#f59e0b'),
			primaryContent: hexToRgba('#1f2937'),
			// secondary: hexToRgba('#dc2626'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#7c3aed'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#fbbf24'),
			neutralContent: hexToRgba('#1f2937'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#f59e0b'),
			warningContent: hexToRgba('#1f2937'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#f0fdf4'),
			base100Content: hexToRgba('#14532d'),
			base200: hexToRgba('#dcfce7'),
			base200Content: hexToRgba('#14532d'),
			primary: hexToRgba('#059669'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#f59e0b'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#10b981'),
			accentContent: hexToRgba('#064e3b'),
			neutral: hexToRgba('#14532d'),
			neutralContent: hexToRgba('#f0fdf4'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#0f172a'),
			base100Content: hexToRgba('#f0fdf4'),
			base200: hexToRgba('#1e293b'),
			base200Content: hexToRgba('#f0fdf4'),
			primary: hexToRgba('#059669'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#10b981'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#34d399'),
			accentContent: hexToRgba('#064e3b'),
			neutral: hexToRgba('#f0fdf4'),
			neutralContent: hexToRgba('#0f172a'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#f0f9ff'),
			base100Content: hexToRgba('#0c4a6e'),
			base200: hexToRgba('#e0f2fe'),
			base200Content: hexToRgba('#0c4a6e'),
			primary: hexToRgba('#0284c7'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#06b6d4'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#0891b2'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#0c4a6e'),
			neutralContent: hexToRgba('#f0f9ff'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#ffffff'),
			base100Content: hexToRgba('#000000'),
			base200: hexToRgba('#f7f7f7'),
			base200Content: hexToRgba('#000000'),
			primary: hexToRgba('#000000'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#7f7f7f'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#7f7f7f'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#000000'),
			neutralContent: hexToRgba('#ffffff'),
			info: hexToRgba('#000000'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#000000'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#000000'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#000000'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#ffffff'),
			base100Content: hexToRgba('#374151'),
			base200: hexToRgba('#fafafa'),
			base200Content: hexToRgba('#374151'),
			primary: hexToRgba('#f3e8ff'),
			primaryContent: hexToRgba('#581c87'),
			// secondary: hexToRgba('#fef3c7'),
			// secondaryContent: hexToRgba('#92400e'),
			accent: hexToRgba('#dbeafe'),
			accentContent: hexToRgba('#1e40af'),
			neutral: hexToRgba('#374151'),
			neutralContent: hexToRgba('#ffffff'),
			info: hexToRgba('#e0f2fe'),
			infoContent: hexToRgba('#0c4a6e'),
			success: hexToRgba('#dcfce7'),
			successContent: hexToRgba('#14532d'),
			warning: hexToRgba('#fef3c7'),
			warningContent: hexToRgba('#92400e'),
			error: hexToRgba('#fee2e2'),
			errorContent: hexToRgba('#7f1d1d')
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
		color: {
			base100: hexToRgba('#ffffff'),
			base100Content: hexToRgba('#1e1b4b'),
			base200: hexToRgba('#f8f8ff'),
			base200Content: hexToRgba('#1e1b4b'),
			primary: hexToRgba('#7c3aed'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#ec4899'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#a855f7'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#1e1b4b'),
			neutralContent: hexToRgba('#ffffff'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#ffffff'),
			base100Content: hexToRgba('#000000'),
			base200: hexToRgba('#f8f8f8'),
			base200Content: hexToRgba('#000000'),
			primary: hexToRgba('#000000'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#000000'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#000000'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#000000'),
			neutralContent: hexToRgba('#ffffff'),
			info: hexToRgba('#000000'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#000000'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#000000'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#000000'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#000000'),
			base100Content: hexToRgba('#ffffff'),
			base200: hexToRgba('#1a1a1a'),
			base200Content: hexToRgba('#ffffff'),
			primary: hexToRgba('#ffffff'),
			primaryContent: hexToRgba('#000000'),
			// secondary: hexToRgba('#ffffff'),
			// secondaryContent: hexToRgba('#000000'),
			accent: hexToRgba('#ffffff'),
			accentContent: hexToRgba('#000000'),
			neutral: hexToRgba('#ffffff'),
			neutralContent: hexToRgba('#000000'),
			info: hexToRgba('#ffffff'),
			infoContent: hexToRgba('#000000'),
			success: hexToRgba('#ffffff'),
			successContent: hexToRgba('#000000'),
			warning: hexToRgba('#ffffff'),
			warningContent: hexToRgba('#000000'),
			error: hexToRgba('#ffffff'),
			errorContent: hexToRgba('#000000')
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
		color: {
			base100: hexToRgba('#ffffff'),
			base100Content: hexToRgba('#1f2937'),
			base200: hexToRgba('#f8f8f8'),
			base200Content: hexToRgba('#1f2937'),
			primary: hexToRgba('#000000'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#1f2937'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#1f2937'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#1f2937'),
			neutralContent: hexToRgba('#ffffff'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#282a36'),
			base100Content: hexToRgba('#f8f8f2'),
			base200: hexToRgba('#44475a'),
			base200Content: hexToRgba('#f8f8f2'),
			primary: hexToRgba('#bd93f9'),
			primaryContent: hexToRgba('#282a36'),
			// secondary: hexToRgba('#ff79c6'),
			// secondaryContent: hexToRgba('#282a36'),
			accent: hexToRgba('#ffb86c'),
			accentContent: hexToRgba('#282a36'),
			neutral: hexToRgba('#f8f8f2'),
			neutralContent: hexToRgba('#282a36'),
			info: hexToRgba('#8be9fd'),
			infoContent: hexToRgba('#282a36'),
			success: hexToRgba('#50fa7b'),
			successContent: hexToRgba('#282a36'),
			warning: hexToRgba('#ffb86c'),
			warningContent: hexToRgba('#282a36'),
			error: hexToRgba('#ff5555'),
			errorContent: hexToRgba('#282a36')
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
		color: {
			base100: hexToRgba('#ffffff'),
			base100Content: hexToRgba('#1f2937'),
			base200: hexToRgba('#f8f8f8'),
			base200Content: hexToRgba('#1f2937'),
			primary: hexToRgba('#0ea5e9'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#ec4899'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#f59e0b'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#1f2937'),
			neutralContent: hexToRgba('#ffffff'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#fef7f5'),
			base100Content: hexToRgba('#7c2d12'),
			base200: hexToRgba('#fde8e0'),
			base200Content: hexToRgba('#7c2d12'),
			primary: hexToRgba('#ea580c'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#dc2626'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#f59e0b'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#7c2d12'),
			neutralContent: hexToRgba('#fef7f5'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#ffffff'),
			base100Content: hexToRgba('#1e293b'),
			base200: hexToRgba('#f8fafc'),
			base200Content: hexToRgba('#1e293b'),
			primary: hexToRgba('#1e40af'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#475569'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#64748b'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#1e293b'),
			neutralContent: hexToRgba('#ffffff'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#000000'),
			base100Content: hexToRgba('#00ff00'),
			base200: hexToRgba('#1a1a1a'),
			base200Content: hexToRgba('#00ff00'),
			primary: hexToRgba('#00ff00'),
			primaryContent: hexToRgba('#000000'),
			// secondary: hexToRgba('#ff00ff'),
			// secondaryContent: hexToRgba('#000000'),
			accent: hexToRgba('#ffff00'),
			accentContent: hexToRgba('#000000'),
			neutral: hexToRgba('#00ff00'),
			neutralContent: hexToRgba('#000000'),
			info: hexToRgba('#00ffff'),
			infoContent: hexToRgba('#000000'),
			success: hexToRgba('#00ff00'),
			successContent: hexToRgba('#000000'),
			warning: hexToRgba('#ffff00'),
			warningContent: hexToRgba('#000000'),
			error: hexToRgba('#ff0000'),
			errorContent: hexToRgba('#000000')
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
		color: {
			base100: hexToRgba('#fefce8'),
			base100Content: hexToRgba('#451a03'),
			base200: hexToRgba('#fef3c7'),
			base200Content: hexToRgba('#451a03'),
			primary: hexToRgba('#65a30d'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#fbbf24'),
			// secondaryContent: hexToRgba('#451a03'),
			accent: hexToRgba('#f59e0b'),
			accentContent: hexToRgba('#451a03'),
			neutral: hexToRgba('#451a03'),
			neutralContent: hexToRgba('#fefce8'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#0f172a'),
			base100Content: hexToRgba('#f1f5f9'),
			base200: hexToRgba('#1e293b'),
			base200Content: hexToRgba('#f1f5f9'),
			primary: hexToRgba('#38bdf8'),
			primaryContent: hexToRgba('#0f172a'),
			// secondary: hexToRgba('#818cf8'),
			// secondaryContent: hexToRgba('#0f172a'),
			accent: hexToRgba('#f472b6'),
			accentContent: hexToRgba('#0f172a'),
			neutral: hexToRgba('#f1f5f9'),
			neutralContent: hexToRgba('#0f172a'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#0f172a'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#0f172a'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#0f172a'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#0f172a')
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
		color: {
			base100: hexToRgba('#1a1a1a'),
			base100Content: hexToRgba('#f5f5f4'),
			base200: hexToRgba('#2d2b42'),
			base200Content: hexToRgba('#f5f5f4'),
			primary: hexToRgba('#db924b'),
			primaryContent: hexToRgba('#1a1a1a'),
			// secondary: hexToRgba('#263e3f'),
			// secondaryContent: hexToRgba('#f5f5f4'),
			accent: hexToRgba('#f0b323'),
			accentContent: hexToRgba('#1a1a1a'),
			neutral: hexToRgba('#f5f5f4'),
			neutralContent: hexToRgba('#1a1a1a'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#1a1a1a'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#1a1a1a'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#1a1a1a'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#1a1a1a')
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
		color: {
			base100: hexToRgba('#f0f9ff'),
			base100Content: hexToRgba('#0c4a6e'),
			base200: hexToRgba('#e0f2fe'),
			base200Content: hexToRgba('#0c4a6e'),
			primary: hexToRgba('#0284c7'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#6366f1'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#ec4899'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#0c4a6e'),
			neutralContent: hexToRgba('#f0f9ff'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
		color: {
			base100: hexToRgba('#1f2937'),
			base100Content: hexToRgba('#f9fafb'),
			base200: hexToRgba('#374151'),
			base200Content: hexToRgba('#f9fafb'),
			primary: hexToRgba('#f59e0b'),
			primaryContent: hexToRgba('#1f2937'),
			// secondary: hexToRgba('#ef4444'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#10b981'),
			accentContent: hexToRgba('#1f2937'),
			neutral: hexToRgba('#f9fafb'),
			neutralContent: hexToRgba('#1f2937'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#1f2937'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#1f2937'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#1f2937'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#1f2937')
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
		color: {
			base100: hexToRgba('#2e3440'),
			base100Content: hexToRgba('#eceff4'),
			base200: hexToRgba('#3b4252'),
			base200Content: hexToRgba('#eceff4'),
			primary: hexToRgba('#88c0d0'),
			primaryContent: hexToRgba('#2e3440'),
			// secondary: hexToRgba('#81a1c1'),
			// secondaryContent: hexToRgba('#2e3440'),
			accent: hexToRgba('#8fbcbb'),
			accentContent: hexToRgba('#2e3440'),
			neutral: hexToRgba('#eceff4'),
			neutralContent: hexToRgba('#2e3440'),
			info: hexToRgba('#5e81ac'),
			infoContent: hexToRgba('#2e3440'),
			success: hexToRgba('#a3be8c'),
			successContent: hexToRgba('#2e3440'),
			warning: hexToRgba('#ebcb8b'),
			warningContent: hexToRgba('#2e3440'),
			error: hexToRgba('#bf616a'),
			errorContent: hexToRgba('#2e3440')
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
		color: {
			base100: hexToRgba('#2d1b69'),
			base100Content: hexToRgba('#ffffff'),
			base200: hexToRgba('#1a103d'),
			base200Content: hexToRgba('#ffffff'),
			primary: hexToRgba('#f97316'),
			primaryContent: hexToRgba('#ffffff'),
			// secondary: hexToRgba('#f59e0b'),
			// secondaryContent: hexToRgba('#ffffff'),
			accent: hexToRgba('#ec4899'),
			accentContent: hexToRgba('#ffffff'),
			neutral: hexToRgba('#ffffff'),
			neutralContent: hexToRgba('#2d1b69'),
			info: hexToRgba('#0ea5e9'),
			infoContent: hexToRgba('#ffffff'),
			success: hexToRgba('#059669'),
			successContent: hexToRgba('#ffffff'),
			warning: hexToRgba('#d97706'),
			warningContent: hexToRgba('#ffffff'),
			error: hexToRgba('#dc2626'),
			errorContent: hexToRgba('#ffffff')
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
	color: {
		// base100/base100Content → Secondary surfaces (cards, widgets) for depth
		base100: TRgba;
		base100Content: TRgba;
		// base200/base200Content → Page-level background and text
		base200: TRgba;
		base200Content: TRgba;
		// primary/primaryContent → Primary buttons and main actions
		primary: TRgba;
		primaryContent: TRgba;
		// secondary: TRgba;
		// secondaryContent: TRgba;
		// neutral/neutralContent → Secondary buttons, badges, and subtle elements
		neutral: TRgba;
		neutralContent: TRgba;
		// accent/accentContent → Border colors and decorative elements
		accent: TRgba;
		accentContent: TRgba;
		// info/infoContent → Informational messages and notifications
		info: TRgba;
		infoContent: TRgba;
		// success/successContent → Success states and positive feedback
		success: TRgba;
		successContent: TRgba;
		// warning/warningContent → Warning states and caution messages
		warning: TRgba;
		warningContent: TRgba;
		// error/errorContent → Error states and negative feedback
		error: TRgba;
		errorContent: TRgba;
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
