// Based on: https://daisyui.com/theme-generator
export const themes: TTheme[] = [
	{
		key: 'light',
		name: 'Light',
		color: {
			base100: '#ffffff',
			base200: '#fafafa',
			base300: '#f2f2f2',
			baseContent: '#353535',
			primary: '#570df8',
			primaryContent: '#f0f0f0',
			secondary: '#f000b8',
			secondaryContent: '#ffffff',
			neutral: '#232323',
			neutralContent: '#ebebeb',
			accent: '#37cdbe',
			accentContent: '#003320',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'dark',
		name: 'Dark',
		color: {
			base100: '#1d232a',
			base200: '#191e24',
			base300: '#15191e',
			baseContent: '#ffffff',
			primary: '#6419e6',
			primaryContent: '#ffffff',
			secondary: '#f000b8',
			secondaryContent: '#ffffff',
			neutral: '#232323',
			neutralContent: '#ebebeb',
			accent: '#37cdbe',
			accentContent: '#003320',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'cupcake',
		name: 'Cupcake',
		color: {
			base100: '#faf7f5',
			base200: '#efeae6',
			base300: '#e7e2df',
			baseContent: '#291334',
			primary: '#65c3c8',
			primaryContent: '#003320',
			secondary: '#ef9fbc',
			secondaryContent: '#4a0e35',
			accent: '#eeaf3a',
			accentContent: '#4a3800',
			neutral: '#291334',
			neutralContent: '#ebebeb',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 16, field: 32, selector: 16 },
		effects: {
			stroke: { width: 2 }
		}
	},
	{
		key: 'bumblebee',
		name: 'Bumblebee',
		color: {
			base100: '#ffffff',
			base200: '#fefce8',
			base300: '#fef3c7',
			baseContent: '#1f2937',
			primary: '#f59e0b',
			primaryContent: '#ffffff',
			secondary: '#fbbf24',
			secondaryContent: '#1f2937',
			accent: '#fbbf24',
			accentContent: '#1f2937',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'emerald',
		name: 'Emerald',
		color: {
			base100: '#ffffff',
			base200: '#f0fdf4',
			base300: '#dcfce7',
			baseContent: '#1f2937',
			primary: '#10b981',
			primaryContent: '#ffffff',
			secondary: '#059669',
			secondaryContent: '#ffffff',
			accent: '#34d399',
			accentContent: '#064e3b',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
			primary: '#4f46e5',
			primaryContent: '#ffffff',
			secondary: '#7c3aed',
			secondaryContent: '#ffffff',
			accent: '#06b6d4',
			accentContent: '#ffffff',
			neutral: '#1e293b',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
			primaryContent: '#ffffff',
			secondary: '#58c7f3',
			secondaryContent: '#003320',
			accent: '#f3cc30',
			accentContent: '#382800',
			neutral: '#ffffff',
			neutralContent: '#2d1b69',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
			secondaryContent: '#ffffff',
			accent: '#dc8850',
			accentContent: '#2d1b69',
			neutral: '#2d1b69',
			neutralContent: '#e4d8b4',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
			secondaryContent: '#003320',
			accent: '#c779e0',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'valentine',
		name: 'Valentine',
		color: {
			base100: '#faf6f6',
			base200: '#f1e4e6',
			base300: '#e9d5d7',
			baseContent: '#632c3b',
			primary: '#e96d7b',
			primaryContent: '#ffffff',
			secondary: '#f4a6b7',
			secondaryContent: '#632c3b',
			accent: '#d4145a',
			accentContent: '#ffffff',
			neutral: '#632c3b',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'halloween',
		name: 'Halloween',
		color: {
			base100: '#ffffff',
			base200: '#f2f2f2',
			base300: '#e5e6e6',
			baseContent: '#1f2937',
			primary: '#f28c18',
			primaryContent: '#ffffff',
			secondary: '#6d3a9c',
			secondaryContent: '#ffffff',
			accent: '#49324b',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'garden',
		name: 'Garden',
		color: {
			base100: '#ffffff',
			base200: '#f0fdf4',
			base300: '#dcfce7',
			baseContent: '#1f2937',
			primary: '#5c7cfa',
			primaryContent: '#ffffff',
			secondary: '#f59e0b',
			secondaryContent: '#ffffff',
			accent: '#37cdbe',
			accentContent: '#003320',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'forest',
		name: 'Forest',
		color: {
			base100: '#171212',
			base200: '#1f1b1b',
			base300: '#282424',
			baseContent: '#ffffff',
			primary: '#6419e6',
			primaryContent: '#ffffff',
			secondary: '#1db954',
			secondaryContent: '#ffffff',
			accent: '#1db954',
			accentContent: '#ffffff',
			neutral: '#ffffff',
			neutralContent: '#171212',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'aqua',
		name: 'Aqua',
		color: {
			base100: '#e0f8ff',
			base200: '#b3e5fc',
			base300: '#81d4fa',
			baseContent: '#0d47a1',
			primary: '#0284c7',
			primaryContent: '#ffffff',
			secondary: '#06b6d4',
			secondaryContent: '#ffffff',
			accent: '#0891b2',
			accentContent: '#ffffff',
			neutral: '#0d47a1',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 },
			shadow: {
				blur: 8,
				offsetX: 0,
				offsetY: 2,
				spread: 0
			}
		}
	},
	{
		key: 'pastel',
		name: 'Pastel',
		color: {
			base100: '#ffffff',
			base200: '#fafafa',
			base300: '#f5f5f5',
			baseContent: '#1f2937',
			primary: '#d1c1d7',
			primaryContent: '#1f2937',
			secondary: '#f6e7a3',
			secondaryContent: '#1f2937',
			accent: '#bbd4c9',
			accentContent: '#1f2937',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
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
			baseContent: '#1f2937',
			primary: '#6d28d9',
			primaryContent: '#ffffff',
			secondary: '#f000b8',
			secondaryContent: '#ffffff',
			accent: '#37cdbe',
			accentContent: '#003320',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
			primary: '#050505',
			primaryContent: '#ffffff',
			secondary: '#1f2937',
			secondaryContent: '#ffffff',
			accent: '#1f2937',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
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
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
			primary: '#45aeee',
			primaryContent: '#ffffff',
			secondary: '#e8486a',
			secondaryContent: '#ffffff',
			accent: '#f7931e',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'autumn',
		name: 'Autumn',
		color: {
			base100: '#ffffff',
			base200: '#f8f8f8',
			base300: '#f0f0f0',
			baseContent: '#1f2937',
			primary: '#d65d31',
			primaryContent: '#ffffff',
			secondary: '#8b5cf6',
			secondaryContent: '#ffffff',
			accent: '#f59e0b',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'business',
		name: 'Business',
		color: {
			base100: '#ffffff',
			base200: '#f8f8f8',
			base300: '#f0f0f0',
			baseContent: '#1f2937',
			primary: '#1d4ed8',
			primaryContent: '#ffffff',
			secondary: '#64748b',
			secondaryContent: '#ffffff',
			accent: '#f59e0b',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'acid',
		name: 'Acid',
		color: {
			base100: '#ffffff',
			base200: '#f8f8f8',
			base300: '#f0f0f0',
			baseContent: '#1f2937',
			primary: '#ff006e',
			primaryContent: '#ffffff',
			secondary: '#8338ec',
			secondaryContent: '#ffffff',
			accent: '#3a86ff',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'lemonade',
		name: 'Lemonade',
		color: {
			base100: '#ffffff',
			base200: '#f8f8f8',
			base300: '#f0f0f0',
			baseContent: '#1f2937',
			primary: '#519903',
			primaryContent: '#ffffff',
			secondary: '#e7e09e',
			secondaryContent: '#1f2937',
			accent: '#fbbd23',
			accentContent: '#1f2937',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'night',
		name: 'Night',
		color: {
			base100: '#0f1729',
			base200: '#1e293b',
			base300: '#334155',
			baseContent: '#ffffff',
			primary: '#38bdf8',
			primaryContent: '#0f1729',
			secondary: '#818cf8',
			secondaryContent: '#0f1729',
			accent: '#f472b6',
			accentContent: '#0f1729',
			neutral: '#ffffff',
			neutralContent: '#0f1729',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'coffee',
		name: 'Coffee',
		color: {
			base100: '#191926',
			base200: '#2d2b42',
			base300: '#454960',
			baseContent: '#ffffff',
			primary: '#db924b',
			primaryContent: '#191926',
			secondary: '#263e3f',
			secondaryContent: '#ffffff',
			accent: '#f0b323',
			accentContent: '#191926',
			neutral: '#ffffff',
			neutralContent: '#191926',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'winter',
		name: 'Winter',
		color: {
			base100: '#ffffff',
			base200: '#f8f8f8',
			base300: '#f0f0f0',
			baseContent: '#1f2937',
			primary: '#057aff',
			primaryContent: '#ffffff',
			secondary: '#463aa1',
			secondaryContent: '#ffffff',
			accent: '#c148ac',
			accentContent: '#ffffff',
			neutral: '#1f2937',
			neutralContent: '#ffffff',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
		}
	},
	{
		key: 'dim',
		name: 'Dim',
		color: {
			base100: '#1f2937',
			base200: '#374151',
			base300: '#4b5563',
			baseContent: '#ffffff',
			primary: '#ff9d3b',
			primaryContent: '#1f2937',
			secondary: '#ff6b6b',
			secondaryContent: '#ffffff',
			accent: '#51cf66',
			accentContent: '#1f2937',
			neutral: '#ffffff',
			neutralContent: '#1f2937',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
			accent: '#e11d48',
			accentContent: '#ffffff',
			neutral: '#ffffff',
			neutralContent: '#2d1b69',
			info: '#3abff8',
			infoContent: '#002b3d',
			success: '#36d399',
			successContent: '#003320',
			warning: '#fbbd23',
			warningContent: '#382800',
			error: '#f87272',
			errorContent: '#470000'
		},
		typography: {
			heading: { fontFamily: 'Inter', fontWeight: 600 },
			text: { fontFamily: 'Inter', fontWeight: 400 }
		},
		radius: { box: 8, field: 4, selector: 8 },
		effects: {
			stroke: { width: 1 }
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
		heading: number; // heading as relative multiplicator (base = 1)
		text: number; // text as relative multiplicator (base = 1)
		box: number; // card, modal, alert, etc. as relative multiplicator (base = 1)
		field: number; // input, select, tab, etc. as relative multiplicator (base = 1)
		selector: number; // checkbox, toggle, badge, etc. as relative multiplicator (base = 1)
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
