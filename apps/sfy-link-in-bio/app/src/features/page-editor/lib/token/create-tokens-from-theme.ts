import { hexToRgba, TToken } from '@repo/editor';
import { themeMetadata, TTheme } from '../../environment';

export function createTokensFromTheme(theme: TTheme): TToken[] {
	const { color, typography, gap = 24, size = {}, radius, effects } = theme;
	const {
		heading: headingSize = themeMetadata.size.text.get(0),
		text: textSize = themeMetadata.size.text.get(0),
		box: boxSize = themeMetadata.size.box.get(0),
		field: fieldSize = themeMetadata.size.box.get(0),
		selector: selectorSize = themeMetadata.size.box.get(0)
	} = size;

	// Calculate semantic sizes
	const textSizes = {
		xs: textSize * themeMetadata.size.text.xs,
		sm: textSize * themeMetadata.size.text.sm,
		md: textSize * themeMetadata.size.text.md,
		lg: textSize * themeMetadata.size.text.lg,
		xl: textSize * themeMetadata.size.text.xl
	};
	const headingSizes = {
		xs: headingSize * themeMetadata.size.heading.xs,
		sm: headingSize * themeMetadata.size.heading.sm,
		md: headingSize * themeMetadata.size.heading.md,
		lg: headingSize * themeMetadata.size.heading.lg,
		xl: headingSize * themeMetadata.size.heading.xl
	};
	const boxSizes = {
		xs: boxSize * themeMetadata.size.box.xs,
		sm: boxSize * themeMetadata.size.box.sm,
		md: boxSize * themeMetadata.size.box.md,
		lg: boxSize * themeMetadata.size.box.lg,
		xl: boxSize * themeMetadata.size.box.xl
	};

	return [
		// Variable tokens (atomic design values)
		{
			type: 'variable',
			key: 'color.primary',
			name: 'Primary Color',
			value: color.primary
		},
		{
			type: 'variable',
			key: 'color.base100',
			name: 'Base 100 Color',
			value: color.base100
		},
		{
			type: 'variable',
			key: 'color.baseContent',
			name: 'Base Content Color',
			value: color.baseContent
		},
		{
			type: 'variable',
			key: 'color.neutral',
			name: 'Neutral Color',
			value: color.neutral
		},
		{
			type: 'variable',
			key: 'color.neutralContent',
			name: 'Neutral Content Color',
			value: color.neutralContent
		},
		{
			type: 'variable',
			key: 'color.accent',
			name: 'Accent Color',
			value: color.accent
		},
		{
			type: 'variable',
			key: 'color.accentContent',
			name: 'Accent Content Color',
			value: color.accentContent
		},
		{
			type: 'variable',
			key: 'color.primaryContent',
			name: 'Primary Content Color',
			value: color.primaryContent
		},
		{
			type: 'variable',
			key: 'typography.heading.fontFamily',
			name: 'Heading Font Family',
			value: typography.heading.fontFamily
		},
		{
			type: 'variable',
			key: 'typography.heading.fontWeight',
			name: 'Heading Font Weight',
			value: typography.heading.fontWeight
		},
		{
			type: 'variable',
			key: 'typography.text.fontFamily',
			name: 'Text Font Family',
			value: typography.text.fontFamily
		},
		{
			type: 'variable',
			key: 'typography.text.fontWeight',
			name: 'Text Font Weight',
			value: typography.text.fontWeight
		},
		{
			type: 'variable',
			key: 'spacing.gap',
			name: 'Gap',
			value: gap
		},
		{
			type: 'variable',
			key: 'size.heading',
			name: 'Heading Size',
			value: headingSize
		},
		{
			type: 'variable',
			key: 'size.text',
			name: 'Text Size',
			value: textSize
		},
		{
			type: 'variable',
			key: 'size.box',
			name: 'Box Size',
			value: boxSize
		},
		{
			type: 'variable',
			key: 'radius.box',
			name: 'Box Border Radius',
			value: radius.box
		},
		{
			type: 'variable',
			key: 'radius.field',
			name: 'Field Border Radius',
			value: radius.field
		},
		{
			type: 'variable',
			key: 'radius.selector',
			name: 'Selector Border Radius',
			value: radius.selector
		},

		// Mixin tokens (component style definitions)
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'autoLayout',
			value: {
				horizontalPadding: boxSizes.lg,
				verticalPadding: boxSizes.lg
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'appearance',
			value: {
				visible: true,
				opacity: 1,
				borderRadius: radius.box
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'typography',
			value: {
				font: {
					family: typography.text.fontFamily,
					weight: typography.text.fontWeight,
					style: 'normal'
				},
				fontSize: textSizes.md,
				textAlignHorizontal: 'center',
				textAlignVertical: 'center',
				lineHeight: { type: 'auto' },
				letterSpacing: { type: 'auto' }
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'fill',
			value: {
				paint: {
					type: 'solid',
					color: hexToRgba(color.base100)
				},
				opacity: 1
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'stroke',
			value:
				effects?.stroke != null
					? {
							color: hexToRgba(color.accent),
							width: effects.stroke.width
						}
					: null
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'shadow',
			value:
				effects?.shadow != null
					? {
							color: { ...hexToRgba(color.baseContent), a: 0.1 },
							offsetX: effects.shadow.offsetX,
							offsetY: effects.shadow.offsetY,
							blur: effects.shadow.blur,
							spread: effects.shadow.spread
						}
					: null
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'text',
			value: {
				appearance: {
					visible: true,
					opacity: 1
				},
				typography: {
					font: {
						family: typography.text.fontFamily,
						weight: typography.text.fontWeight,
						style: 'normal'
					},
					fontSize: textSizes.md,
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: { type: 'auto' },
					letterSpacing: { type: 'auto' }
				},
				fill: {
					paint: {
						type: 'solid',
						color: hexToRgba(color.baseContent)
					},
					opacity: 1
				},
				stroke: null,
				shadow: null
			}
		},
		{
			type: 'mixin',
			key: 'heading',
			mixinKey: 'text',
			value: {
				appearance: {
					visible: true,
					opacity: 1
				},
				typography: {
					font: {
						family: typography.heading.fontFamily,
						weight: typography.heading.fontWeight,
						style: 'normal'
					},
					fontSize: headingSizes.sm,
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: { type: 'auto' },
					letterSpacing: { type: 'auto' }
				},
				fill: {
					paint: {
						type: 'solid',
						color: hexToRgba(color.baseContent)
					},
					opacity: 1
				},
				stroke: null,
				shadow: null
			}
		},
		{
			type: 'mixin',
			key: 'primary',
			mixinKey: 'button',
			value: {
				appearance: {
					visible: true,
					opacity: 1,
					borderRadius: radius.field
				},
				fill: {
					paint: {
						type: 'solid',
						color: hexToRgba(color.primary)
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
							family: typography.text.fontFamily,
							weight: typography.text.fontWeight,
							style: 'normal'
						},
						fontSize: textSizes.md,
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'solid',
							color: hexToRgba(color.primaryContent)
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				}
			}
		},
		{
			type: 'mixin',
			key: 'secondary',
			mixinKey: 'button',
			value: {
				appearance: {
					visible: true,
					opacity: 1,
					borderRadius: radius.field
				},
				fill: {
					paint: {
						type: 'solid',
						color: hexToRgba(color.neutral)
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
							family: typography.text.fontFamily,
							weight: typography.text.fontWeight,
							style: 'normal'
						},
						fontSize: textSizes.md,
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'solid',
							color: hexToRgba(color.neutralContent)
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				}
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'badge',
			value: {
				appearance: {
					visible: true,
					opacity: 1,
					borderRadius: radius.selector
				},
				fill: {
					paint: {
						type: 'solid',
						color: hexToRgba(color.accent)
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
							family: typography.text.fontFamily,
							weight: typography.text.fontWeight,
							style: 'normal'
						},
						fontSize: textSizes.sm,
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'solid',
							color: hexToRgba(color.accentContent)
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				}
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'image',
			value: {
				appearance: {
					visible: true,
					opacity: 1,
					borderRadius: radius.box
				},
				stroke: null,
				shadow: null
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'productDetails',
			value: {
				appearance: {
					visible: true,
					opacity: 1,
					borderRadius: radius.box
				},
				fill: {
					paint: {
						type: 'solid',
						color: hexToRgba(color.base100)
					},
					opacity: 1
				},
				stroke: null,
				shadow: null,
				headingText: {
					appearance: {
						visible: true,
						opacity: 1
					},
					typography: {
						font: {
							family: typography.heading.fontFamily,
							weight: typography.heading.fontWeight,
							style: 'normal'
						},
						fontSize: headingSizes.md,
						textAlignHorizontal: 'start',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'solid',
							color: hexToRgba(color.baseContent)
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				},
				text: {
					appearance: {
						visible: true,
						opacity: 1
					},
					typography: {
						font: {
							family: typography.text.fontFamily,
							weight: typography.text.fontWeight,
							style: 'normal'
						},
						fontSize: textSizes.md,
						textAlignHorizontal: 'start',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'solid',
							color: hexToRgba(color.baseContent)
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				},
				primaryButton: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: radius.field
					},
					fill: {
						paint: {
							type: 'solid',
							color: hexToRgba(color.primary)
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
								family: typography.text.fontFamily,
								weight: typography.text.fontWeight,
								style: 'normal'
							},
							fontSize: textSizes.md,
							textAlignHorizontal: 'center',
							textAlignVertical: 'center',
							lineHeight: { type: 'auto' },
							letterSpacing: { type: 'auto' }
						},
						fill: {
							paint: {
								type: 'solid',
								color: hexToRgba(color.primaryContent)
							},
							opacity: 1
						},
						stroke: null,
						shadow: null
					}
				},
				image: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: radius.box
					},
					stroke: null,
					shadow: null
				}
			}
		}
	];
}
