// Inspired by: https://daisyui.com/theme-generator
export const themes: TTheme[] = [
	{
		key: 'light',
		name: 'Light',
		color: {
			base100: '#ffffff',
			base200: '#f8fafc',
			base300: '#e2e8f0',
			baseContent: '#1e293b',
			primary: '#3b82f6',
			primaryContent: '#ffffff',
			secondary: '#8b5cf6',
			secondaryContent: '#ffffff',
			neutral: '#64748b',
			neutralContent: '#ffffff',
			accent: '#e2e8f0',
			accentContent: '#475569',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#10b981',
			successContent: '#ffffff',
			warning: '#f59e0b',
			warningContent: '#ffffff',
			error: '#ef4444',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
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
			base100: '#0f172a',
			base200: '#1e293b',
			base300: '#334155',
			baseContent: '#f1f5f9',
			primary: '#6366f1',
			primaryContent: '#ffffff',
			secondary: '#a855f7',
			secondaryContent: '#ffffff',
			neutral: '#94a3b8',
			neutralContent: '#0f172a',
			accent: '#334155',
			accentContent: '#cbd5e1',
			info: '#06b6d4',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
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
			base100: '#fef7f5',
			base200: '#fdf2f8',
			base300: '#fce7f3',
			baseContent: '#581c87',
			primary: '#ec4899',
			primaryContent: '#ffffff',
			secondary: '#f59e0b',
			secondaryContent: '#ffffff',
			accent: '#fbbf24',
			accentContent: '#92400e',
			neutral: '#581c87',
			neutralContent: '#fdf2f8',
			info: '#06b6d4',
			infoContent: '#ffffff',
			success: '#10b981',
			successContent: '#ffffff',
			warning: '#f59e0b',
			warningContent: '#ffffff',
			error: '#ef4444',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Poppins', fontWeight: 600 },
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
			base100: '#fefce8',
			base200: '#fef3c7',
			base300: '#fde68a',
			baseContent: '#451a03',
			primary: '#d97706',
			primaryContent: '#ffffff',
			secondary: '#fbbf24',
			secondaryContent: '#451a03',
			accent: '#f59e0b',
			accentContent: '#451a03',
			neutral: '#451a03',
			neutralContent: '#fefce8',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Montserrat', fontWeight: 600 },
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
			base100: '#f0fdf4',
			base200: '#dcfce7',
			base300: '#bbf7d0',
			baseContent: '#14532d',
			primary: '#059669',
			primaryContent: '#ffffff',
			secondary: '#10b981',
			secondaryContent: '#ffffff',
			accent: '#34d399',
			accentContent: '#064e3b',
			neutral: '#14532d',
			neutralContent: '#f0fdf4',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Karla', fontWeight: 600 },
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
			base100: '#ffffff',
			base200: '#f8fafc',
			base300: '#e2e8f0',
			baseContent: '#1e293b',
			primary: '#1e40af',
			primaryContent: '#ffffff',
			secondary: '#475569',
			secondaryContent: '#ffffff',
			accent: '#64748b',
			accentContent: '#ffffff',
			neutral: '#1e293b',
			neutralContent: '#ffffff',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Roboto', fontWeight: 600 },
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
			base100: '#2d1b69',
			base200: '#1a103d',
			base300: '#0f0a23',
			baseContent: '#ffffff',
			primary: '#e779c1',
			primaryContent: '#2d1b69',
			secondary: '#58c7f3',
			secondaryContent: '#2d1b69',
			accent: '#f3cc30',
			accentContent: '#2d1b69',
			neutral: '#ffffff',
			neutralContent: '#2d1b69',
			info: '#3abff8',
			infoContent: '#2d1b69',
			success: '#36d399',
			successContent: '#2d1b69',
			warning: '#fbbd23',
			warningContent: '#2d1b69',
			error: '#f87272',
			errorContent: '#2d1b69'
		},
		typography: {
			heading: { fontFamily: 'B612', fontWeight: 600 },
			text: { fontFamily: 'B612', fontWeight: 400 }
		},
		size: {
			text: 0.9,
			box: 0.8
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
			base100: '#e4d8b4',
			base200: '#d4c494',
			base300: '#c4b074',
			baseContent: '#2d1b69',
			primary: '#ef9995',
			primaryContent: '#2d1b69',
			secondary: '#a991f7',
			secondaryContent: '#2d1b69',
			accent: '#dc8850',
			accentContent: '#2d1b69',
			neutral: '#2d1b69',
			neutralContent: '#e4d8b4',
			info: '#3abff8',
			infoContent: '#2d1b69',
			success: '#36d399',
			successContent: '#2d1b69',
			warning: '#fbbd23',
			warningContent: '#2d1b69',
			error: '#f87272',
			errorContent: '#2d1b69'
		},
		typography: {
			heading: { fontFamily: 'Playfair Display', fontWeight: 600 },
			text: { fontFamily: 'Lora', fontWeight: 400 }
		},
		size: {
			text: 1.2,
			box: 1.4
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
			base100: '#ffffff',
			base200: '#f2f2f2',
			base300: '#e5e6e6',
			baseContent: '#1f2937',
			primary: '#ff7598',
			primaryContent: '#ffffff',
			secondary: '#75d1f0',
			secondaryContent: '#1f2937',
			accent: '#c779e0',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#1f2937',
			success: '#36d399',
			successContent: '#1f2937',
			warning: '#fbbd23',
			warningContent: '#1f2937',
			error: '#f87272',
			errorContent: '#1f2937'
		},
		typography: {
			heading: { fontFamily: 'B612', fontWeight: 600 },
			text: { fontFamily: 'B612', fontWeight: 400 }
		},
		radius: { box: 0, field: 0, selector: 0 },
		effects: {
			stroke: { width: 3 },
			shadow: {
				blur: 0,
				offsetX: 0,
				offsetY: 0,
				spread: 4
			}
		}
	},
	{
		key: 'valentine',
		name: 'Valentine',
		color: {
			base100: '#fef2f2',
			base200: '#fecaca',
			base300: '#fca5a5',
			baseContent: '#7f1d1d',
			primary: '#dc2626',
			primaryContent: '#ffffff',
			secondary: '#f472b6',
			secondaryContent: '#ffffff',
			accent: '#ec4899',
			accentContent: '#ffffff',
			neutral: '#7f1d1d',
			neutralContent: '#fef2f2',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Playfair Display', fontWeight: 600 },
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
			base100: '#1f2937',
			base200: '#374151',
			base300: '#4b5563',
			baseContent: '#fbbf24',
			primary: '#f59e0b',
			primaryContent: '#1f2937',
			secondary: '#dc2626',
			secondaryContent: '#ffffff',
			accent: '#7c3aed',
			accentContent: '#ffffff',
			neutral: '#fbbf24',
			neutralContent: '#1f2937',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#f59e0b',
			warningContent: '#1f2937',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'BioRhyme', fontWeight: 600 },
			text: { fontFamily: 'BioRhyme', fontWeight: 400 }
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
			base100: '#f0fdf4',
			base200: '#dcfce7',
			base300: '#bbf7d0',
			baseContent: '#14532d',
			primary: '#059669',
			primaryContent: '#ffffff',
			secondary: '#f59e0b',
			secondaryContent: '#ffffff',
			accent: '#10b981',
			accentContent: '#064e3b',
			neutral: '#14532d',
			neutralContent: '#f0fdf4',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 1.05,
			box: 1.15
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
			base100: '#0f172a',
			base200: '#1e293b',
			base300: '#334155',
			baseContent: '#f0fdf4',
			primary: '#059669',
			primaryContent: '#ffffff',
			secondary: '#10b981',
			secondaryContent: '#ffffff',
			accent: '#34d399',
			accentContent: '#064e3b',
			neutral: '#f0fdf4',
			neutralContent: '#0f172a',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 1.1,
			box: 1.2
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
			base100: '#f0f9ff',
			base200: '#e0f2fe',
			base300: '#bae6fd',
			baseContent: '#0c4a6e',
			primary: '#0284c7',
			primaryContent: '#ffffff',
			secondary: '#06b6d4',
			secondaryContent: '#ffffff',
			accent: '#0891b2',
			accentContent: '#ffffff',
			neutral: '#0c4a6e',
			neutralContent: '#f0f9ff',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 1.05,
			box: 1.1
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
			base100: '#ffffff',
			base200: '#f7f7f7',
			base300: '#e3e3e3',
			baseContent: '#000000',
			primary: '#000000',
			primaryContent: '#ffffff',
			secondary: '#7f7f7f',
			secondaryContent: '#ffffff',
			accent: '#7f7f7f',
			accentContent: '#ffffff',
			neutral: '#000000',
			neutralContent: '#ffffff',
			info: '#000000',
			infoContent: '#ffffff',
			success: '#000000',
			successContent: '#ffffff',
			warning: '#000000',
			warningContent: '#ffffff',
			error: '#000000',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Cairo', fontWeight: 600 },
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
			base100: '#ffffff',
			base200: '#fafafa',
			base300: '#f5f5f5',
			baseContent: '#374151',
			primary: '#f3e8ff',
			primaryContent: '#581c87',
			secondary: '#fef3c7',
			secondaryContent: '#92400e',
			accent: '#dbeafe',
			accentContent: '#1e40af',
			neutral: '#374151',
			neutralContent: '#ffffff',
			info: '#e0f2fe',
			infoContent: '#0c4a6e',
			success: '#dcfce7',
			successContent: '#14532d',
			warning: '#fef3c7',
			warningContent: '#92400e',
			error: '#fee2e2',
			errorContent: '#7f1d1d'
		},
		typography: {
			heading: { fontFamily: 'Mulish', fontWeight: 600 },
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
			base100: '#ffffff',
			base200: '#f8f8ff',
			base300: '#f0f0ff',
			baseContent: '#1e1b4b',
			primary: '#7c3aed',
			primaryContent: '#ffffff',
			secondary: '#ec4899',
			secondaryContent: '#ffffff',
			accent: '#a855f7',
			accentContent: '#ffffff',
			neutral: '#1e1b4b',
			neutralContent: '#ffffff',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Vollkorn', fontWeight: 600 },
			text: { fontFamily: 'Vollkorn', fontWeight: 400 }
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
			base100: '#ffffff',
			base200: '#f8f8f8',
			base300: '#f0f0f0',
			baseContent: '#000000',
			primary: '#000000',
			primaryContent: '#ffffff',
			secondary: '#000000',
			secondaryContent: '#ffffff',
			accent: '#000000',
			accentContent: '#ffffff',
			neutral: '#000000',
			neutralContent: '#ffffff',
			info: '#000000',
			infoContent: '#ffffff',
			success: '#000000',
			successContent: '#ffffff',
			warning: '#000000',
			warningContent: '#ffffff',
			error: '#000000',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'system-ui', fontWeight: 600 },
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
			base100: '#000000',
			base200: '#1a1a1a',
			base300: '#333333',
			baseContent: '#ffffff',
			primary: '#ffffff',
			primaryContent: '#000000',
			secondary: '#ffffff',
			secondaryContent: '#000000',
			accent: '#ffffff',
			accentContent: '#000000',
			neutral: '#ffffff',
			neutralContent: '#000000',
			info: '#ffffff',
			infoContent: '#000000',
			success: '#ffffff',
			successContent: '#000000',
			warning: '#ffffff',
			warningContent: '#000000',
			error: '#ffffff',
			errorContent: '#000000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
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
			base100: '#ffffff',
			base200: '#f8f8f8',
			base300: '#f0f0f0',
			baseContent: '#1f2937',
			primary: '#000000',
			primaryContent: '#ffffff',
			secondary: '#1f2937',
			secondaryContent: '#ffffff',
			accent: '#1f2937',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Playfair Display', fontWeight: 600 },
			text: { fontFamily: 'Lora', fontWeight: 400 }
		},
		size: {
			text: 0.95,
			box: 0.7
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
			base100: '#282a36',
			base200: '#44475a',
			base300: '#6272a4',
			baseContent: '#f8f8f2',
			primary: '#bd93f9',
			primaryContent: '#282a36',
			secondary: '#ff79c6',
			secondaryContent: '#282a36',
			accent: '#ffb86c',
			accentContent: '#282a36',
			neutral: '#f8f8f2',
			neutralContent: '#282a36',
			info: '#8be9fd',
			infoContent: '#282a36',
			success: '#50fa7b',
			successContent: '#282a36',
			warning: '#ffb86c',
			warningContent: '#282a36',
			error: '#ff5555',
			errorContent: '#282a36'
		},
		typography: {
			heading: { fontFamily: 'BioRhyme', fontWeight: 600 },
			text: { fontFamily: 'BioRhyme', fontWeight: 400 }
		},
		size: {
			text: 1.05,
			box: 1.1
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
			base100: '#ffffff',
			base200: '#f8f8f8',
			base300: '#f0f0f0',
			baseContent: '#1f2937',
			primary: '#0ea5e9',
			primaryContent: '#ffffff',
			secondary: '#ec4899',
			secondaryContent: '#ffffff',
			accent: '#f59e0b',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 0.95,
			box: 0.9
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
			base100: '#fef7f5',
			base200: '#fde8e0',
			base300: '#fcd5c5',
			baseContent: '#7c2d12',
			primary: '#ea580c',
			primaryContent: '#ffffff',
			secondary: '#dc2626',
			secondaryContent: '#ffffff',
			accent: '#f59e0b',
			accentContent: '#ffffff',
			neutral: '#7c2d12',
			neutralContent: '#fef7f5',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 1.1,
			box: 1.15
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
			base100: '#ffffff',
			base200: '#f8fafc',
			base300: '#e2e8f0',
			baseContent: '#1e293b',
			primary: '#1e40af',
			primaryContent: '#ffffff',
			secondary: '#475569',
			secondaryContent: '#ffffff',
			accent: '#64748b',
			accentContent: '#ffffff',
			neutral: '#1e293b',
			neutralContent: '#ffffff',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
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
			base100: '#000000',
			base200: '#1a1a1a',
			base300: '#333333',
			baseContent: '#00ff00',
			primary: '#00ff00',
			primaryContent: '#000000',
			secondary: '#ff00ff',
			secondaryContent: '#000000',
			accent: '#ffff00',
			accentContent: '#000000',
			neutral: '#00ff00',
			neutralContent: '#000000',
			info: '#00ffff',
			infoContent: '#000000',
			success: '#00ff00',
			successContent: '#000000',
			warning: '#ffff00',
			warningContent: '#000000',
			error: '#ff0000',
			errorContent: '#000000'
		},
		typography: {
			heading: { fontFamily: 'B612', fontWeight: 600 },
			text: { fontFamily: 'B612', fontWeight: 400 }
		},
		size: {
			text: 1,
			box: 0.9
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
			base100: '#fefce8',
			base200: '#fef3c7',
			base300: '#fde68a',
			baseContent: '#451a03',
			primary: '#65a30d',
			primaryContent: '#ffffff',
			secondary: '#fbbf24',
			secondaryContent: '#451a03',
			accent: '#f59e0b',
			accentContent: '#451a03',
			neutral: '#451a03',
			neutralContent: '#fefce8',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 1.1,
			box: 1.2
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
			base100: '#0f172a',
			base200: '#1e293b',
			base300: '#334155',
			baseContent: '#f1f5f9',
			primary: '#38bdf8',
			primaryContent: '#0f172a',
			secondary: '#818cf8',
			secondaryContent: '#0f172a',
			accent: '#f472b6',
			accentContent: '#0f172a',
			neutral: '#f1f5f9',
			neutralContent: '#0f172a',
			info: '#0ea5e9',
			infoContent: '#0f172a',
			success: '#059669',
			successContent: '#0f172a',
			warning: '#d97706',
			warningContent: '#0f172a',
			error: '#dc2626',
			errorContent: '#0f172a'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 1.05,
			box: 1.15
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
			base100: '#1a1a1a',
			base200: '#2d2b42',
			base300: '#454960',
			baseContent: '#f5f5f4',
			primary: '#db924b',
			primaryContent: '#1a1a1a',
			secondary: '#263e3f',
			secondaryContent: '#f5f5f4',
			accent: '#f0b323',
			accentContent: '#1a1a1a',
			neutral: '#f5f5f4',
			neutralContent: '#1a1a1a',
			info: '#0ea5e9',
			infoContent: '#1a1a1a',
			success: '#059669',
			successContent: '#1a1a1a',
			warning: '#d97706',
			warningContent: '#1a1a1a',
			error: '#dc2626',
			errorContent: '#1a1a1a'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 1.1,
			box: 1.2
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
			base100: '#f0f9ff',
			base200: '#e0f2fe',
			base300: '#bae6fd',
			baseContent: '#0c4a6e',
			primary: '#0284c7',
			primaryContent: '#ffffff',
			secondary: '#6366f1',
			secondaryContent: '#ffffff',
			accent: '#ec4899',
			accentContent: '#ffffff',
			neutral: '#0c4a6e',
			neutralContent: '#f0f9ff',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 1.05,
			box: 1.1
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
			base100: '#1f2937',
			base200: '#374151',
			base300: '#4b5563',
			baseContent: '#f9fafb',
			primary: '#f59e0b',
			primaryContent: '#1f2937',
			secondary: '#ef4444',
			secondaryContent: '#ffffff',
			accent: '#10b981',
			accentContent: '#1f2937',
			neutral: '#f9fafb',
			neutralContent: '#1f2937',
			info: '#0ea5e9',
			infoContent: '#1f2937',
			success: '#059669',
			successContent: '#1f2937',
			warning: '#d97706',
			warningContent: '#1f2937',
			error: '#dc2626',
			errorContent: '#1f2937'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
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
			base100: '#2e3440',
			base200: '#3b4252',
			base300: '#434c5e',
			baseContent: '#eceff4',
			primary: '#88c0d0',
			primaryContent: '#2e3440',
			secondary: '#81a1c1',
			secondaryContent: '#2e3440',
			accent: '#8fbcbb',
			accentContent: '#2e3440',
			neutral: '#eceff4',
			neutralContent: '#2e3440',
			info: '#5e81ac',
			infoContent: '#2e3440',
			success: '#a3be8c',
			successContent: '#2e3440',
			warning: '#ebcb8b',
			warningContent: '#2e3440',
			error: '#bf616a',
			errorContent: '#2e3440'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
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
			base100: '#2d1b69',
			base200: '#1a103d',
			base300: '#0f0a23',
			baseContent: '#ffffff',
			primary: '#f97316',
			primaryContent: '#ffffff',
			secondary: '#f59e0b',
			secondaryContent: '#ffffff',
			accent: '#ec4899',
			accentContent: '#ffffff',
			neutral: '#ffffff',
			neutralContent: '#2d1b69',
			info: '#0ea5e9',
			infoContent: '#ffffff',
			success: '#059669',
			successContent: '#ffffff',
			warning: '#d97706',
			warningContent: '#ffffff',
			error: '#dc2626',
			errorContent: '#ffffff'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		size: {
			text: 1.1,
			box: 1.2
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
		base100: `#${string}`;
		base200: `#${string}`;
		base300: `#${string}`;
		baseContent: `#${string}`;
		primary: `#${string}`;
		primaryContent: `#${string}`;
		secondary: `#${string}`;
		secondaryContent: `#${string}`;
		neutral: `#${string}`;
		neutralContent: `#${string}`;
		accent: `#${string}`;
		accentContent: `#${string}`;
		info: `#${string}`;
		infoContent: `#${string}`;
		success: `#${string}`;
		successContent: `#${string}`;
		warning: `#${string}`;
		warningContent: `#${string}`;
		error: `#${string}`;
		errorContent: `#${string}`;
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
		heading?: number; // heading size multiplier (1 = default)
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
