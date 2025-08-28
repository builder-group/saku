import { hexToRgba, TToken } from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { TPageEditor } from '../../../lib';

export const DesignContentTemplateTab: React.FC<TDesignContentTemplateTabProps> = (props) => {
	const { editor } = props;

	const applyTemplate = React.useCallback(
		(template: TTemplate) => {
			const { colors } = template;

			// Apply tokens for elements (cards, text, buttons)
			template.tokens.forEach((token) => {
				editor.tokensMap[token.type]?.set((tokenSet: any) => ({
					...tokenSet,
					[token.key]: token.value
				}));
			});

			// Apply page background directly to the root node
			const rootNode = editor.getRootNode();
			rootNode.set((node) => ({
				...node,
				fill: {
					paint: {
						type: 'solid',
						color: hexToRgba(colors.background)
					},
					opacity: 1
				}
			}));

			console.log('Applied template:', template.name, 'tokensMap:', editor.tokensMap);
		},
		[editor]
	);

	const renderTemplatePreview = React.useCallback((template: TTemplate) => {
		const { colors, typography, spacing } = template;

		return (
			<div
				className="rounded-lg border p-4"
				style={{
					backgroundColor: colors.background,
					borderColor: 'rgba(0,0,0,0.1)',
					minHeight: '80px'
				}}
			>
				{/* Single card with Aa and Button - responsive layout */}
				<div
					className="flex flex-wrap items-center gap-2 rounded p-3"
					style={{
						backgroundColor: colors.surface,
						borderRadius: `${spacing.borderRadius}px`,
						border: `1px solid ${colors.secondary}`,
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}
				>
					{/* Typography preview */}
					<h2
						style={{
							color: colors.text,
							fontFamily: typography.fontFamily,
							fontSize: '24px',
							fontWeight: typography.fontWeight,
							lineHeight: 1,
							margin: 0,
							minWidth: '30px'
						}}
					>
						Aa
					</h2>

					{/* Button preview */}
					<div
						className="rounded px-4 py-2 text-sm font-medium"
						style={{
							backgroundColor: colors.primary,
							color: colors.surface,
							fontFamily: typography.fontFamily,
							fontWeight: typography.fontWeight,
							borderRadius: `${spacing.borderRadius}px`
						}}
					>
						Button
					</div>
				</div>
			</div>
		);
	}, []);

	return (
		<div className="grid grid-cols-2 gap-3 p-4">
			{templates.map((template) => (
				<div
					key={template.key}
					className="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-gray-300 hover:shadow-sm"
					onClick={() => applyTemplate(template)}
				>
					{/* Header with colors, name, and apply badge */}
					<div className="mb-3 flex items-center gap-2">
						{/* Color palette grid */}
						<div
							className="grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
							style={{ backgroundColor: template.colors.background }}
						>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.colors.primary }}
								title="Primary"
							/>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.colors.secondary }}
								title="Secondary"
							/>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.colors.surface }}
								title="Surface"
							/>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.colors.primary }}
								title="Accent"
							/>
						</div>

						<Text as="p" variant="bodySm" fontWeight="medium">
							{template.name}
						</Text>
					</div>

					{/* Preview */}
					{renderTemplatePreview(template)}
				</div>
			))}
		</div>
	);
};

interface TDesignContentTemplateTabProps {
	editor: TPageEditor;
}

interface TTemplate {
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
	tokens: TToken[];
}

const templateConfigs = [
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

const templates: TTemplate[] = templateConfigs.map((config) => {
	const { colors, typography, spacing } = config;

	return {
		...config,
		tokens: [
			{
				type: 'autoLayout',
				key: 'default',
				value: {
					horizontalPadding: spacing.padding,
					verticalPadding: spacing.padding,
					horizontalGap: spacing.gap,
					verticalGap: spacing.gap
				}
			},
			{
				type: 'appearance',
				key: 'default',
				value: {
					visible: true,
					opacity: 1,
					borderRadius: spacing.borderRadius
				}
			},
			{
				type: 'typography',
				key: 'default',
				value: {
					font: { family: typography.fontFamily, weight: typography.fontWeight, style: 'normal' },
					fontSize: typography.fontSize,
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: { type: 'auto' },
					letterSpacing: { type: 'auto' }
				}
			},
			{
				type: 'fill',
				key: 'default',
				value: {
					paint: {
						type: 'solid',
						color: hexToRgba(colors.surface)
					},
					opacity: 1
				}
			},
			{
				type: 'stroke',
				key: 'default',
				value: {
					color: hexToRgba(colors.secondary),
					width: 1
				}
			},
			{
				type: 'shadow',
				key: 'default',
				value: {
					color: { ...hexToRgba(colors.primary), a: 0.15 },
					offsetX: 0,
					offsetY: 4,
					blur: 12,
					spread: -2
				}
			},
			{
				type: 'text',
				key: 'default',
				value: {
					appearance: {
						visible: true,
						opacity: 1
					},
					typography: {
						font: { family: typography.fontFamily, weight: typography.fontWeight, style: 'normal' },
						fontSize: typography.fontSize,
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'solid',
							color: hexToRgba(colors.text)
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				}
			},
			{
				type: 'button',
				key: 'default',
				value: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: spacing.borderRadius
					},
					fill: {
						paint: {
							type: 'solid',
							color: hexToRgba(colors.primary)
						},
						opacity: 1
					},
					stroke: null,
					shadow: null,
					text: {
						appearance: {
							visible: true,
							opacity: 1
						},
						typography: {
							font: {
								family: typography.fontFamily,
								weight: typography.fontWeight,
								style: 'normal'
							},
							fontSize: typography.fontSize,
							textAlignHorizontal: 'center',
							textAlignVertical: 'center',
							lineHeight: { type: 'auto' },
							letterSpacing: { type: 'auto' }
						},
						fill: {
							paint: {
								type: 'solid',
								color: hexToRgba(colors.surface)
							},
							opacity: 1
						},
						stroke: null,
						shadow: null
					}
				}
			}
		]
	};
});
