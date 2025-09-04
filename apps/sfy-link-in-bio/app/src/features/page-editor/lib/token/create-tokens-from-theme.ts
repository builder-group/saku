import { hexToRgba, TToken } from '@repo/editor';
import { themeMetadata, TTheme } from '../../environment';

export function createTokensFromTheme(theme: TTheme): TToken[] {
	const { color, typography, gap = 24, size = {}, radius, effects } = theme;
	const {
		text: textSize = themeMetadata.size.text.get(0),
		box: boxSize = themeMetadata.size.box.get(0)
		// field: fieldSize = themeMetadata.size.box.get(0),
		// selector: selectorSize = themeMetadata.size.box.get(0)
	} = size;

	// Calculate semantic sizes
	const textSizes = {
		xs: textSize * themeMetadata.size.text.xs,
		sm: textSize * themeMetadata.size.text.sm,
		md: textSize * themeMetadata.size.text.md,
		lg: textSize * themeMetadata.size.text.lg,
		xl: textSize * themeMetadata.size.text.xl
	};
	const boxSizes = {
		xs: boxSize * themeMetadata.size.box.xs,
		sm: boxSize * themeMetadata.size.box.sm,
		md: boxSize * themeMetadata.size.box.md,
		lg: boxSize * themeMetadata.size.box.lg,
		xl: boxSize * themeMetadata.size.box.xl
	};

	return [
		// Theme metadata
		{
			type: 'variable',
			key: 'theme.key',
			value: theme.key
		},
		{
			type: 'variable',
			key: 'theme.name',
			value: theme.name
		},

		// Color tokens
		{
			type: 'variable',
			key: 'color.base100',
			value: color.base100
		},
		{
			type: 'variable',
			key: 'color.base200',
			value: color.base200
		},
		{
			type: 'variable',
			key: 'color.base300',
			value: color.base300
		},
		{
			type: 'variable',
			key: 'color.baseContent',
			value: color.baseContent
		},
		{
			type: 'variable',
			key: 'color.primary',
			value: color.primary
		},
		{
			type: 'variable',
			key: 'color.primaryContent',
			value: color.primaryContent
		},
		{
			type: 'variable',
			key: 'color.secondary',
			value: color.secondary
		},
		{
			type: 'variable',
			key: 'color.secondaryContent',
			value: color.secondaryContent
		},
		{
			type: 'variable',
			key: 'color.neutral',
			value: color.neutral
		},
		{
			type: 'variable',
			key: 'color.neutralContent',
			value: color.neutralContent
		},
		{
			type: 'variable',
			key: 'color.accent',
			value: color.accent
		},
		{
			type: 'variable',
			key: 'color.accentContent',
			value: color.accentContent
		},
		{
			type: 'variable',
			key: 'color.info',
			value: color.info
		},
		{
			type: 'variable',
			key: 'color.infoContent',
			value: color.infoContent
		},
		{
			type: 'variable',
			key: 'color.success',
			value: color.success
		},
		{
			type: 'variable',
			key: 'color.successContent',
			value: color.successContent
		},
		{
			type: 'variable',
			key: 'color.warning',
			value: color.warning
		},
		{
			type: 'variable',
			key: 'color.warningContent',
			value: color.warningContent
		},
		{
			type: 'variable',
			key: 'color.error',
			value: color.error
		},
		{
			type: 'variable',
			key: 'color.errorContent',
			value: color.errorContent
		},

		// Typography tokens
		{
			type: 'variable',
			key: 'typography.heading.fontFamily',
			value: typography.heading.fontFamily
		},
		{
			type: 'variable',
			key: 'typography.heading.fontWeight',
			value: typography.heading.fontWeight
		},
		{
			type: 'variable',
			key: 'typography.text.fontFamily',
			value: typography.text.fontFamily
		},
		{
			type: 'variable',
			key: 'typography.text.fontWeight',
			value: typography.text.fontWeight
		},

		// Spacing tokens
		{
			type: 'variable',
			key: 'spacing.gap',
			value: gap
		},

		// Size tokens
		{
			type: 'variable',
			key: 'size.text',
			value: textSize
		},
		{
			type: 'variable',
			key: 'size.box',
			value: boxSize
		},
		{
			type: 'variable',
			key: 'size.field',
			value: size.field ?? themeMetadata.size.box.get(0)
		},
		{
			type: 'variable',
			key: 'size.selector',
			value: size.selector ?? themeMetadata.size.box.get(0)
		},

		// Radius tokens
		{
			type: 'variable',
			key: 'radius.box',
			value: radius.box
		},
		{
			type: 'variable',
			key: 'radius.field',
			value: radius.field
		},
		{
			type: 'variable',
			key: 'radius.selector',
			value: radius.selector
		},

		// Effects tokens
		{
			type: 'variable',
			key: 'effects.stroke.width',
			value: effects?.stroke?.width ?? 0
		},
		{
			type: 'variable',
			key: 'effects.shadow.blur',
			value: effects?.shadow?.blur ?? 0
		},
		{
			type: 'variable',
			key: 'effects.shadow.offsetX',
			value: effects?.shadow?.offsetX ?? 0
		},
		{
			type: 'variable',
			key: 'effects.shadow.offsetY',
			value: effects?.shadow?.offsetY ?? 0
		},
		{
			type: 'variable',
			key: 'effects.shadow.spread',
			value: effects?.shadow?.spread ?? 0
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
			key: 'xl',
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
					fontSize: textSizes.lg,
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
			key: 'sm',
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
					fontSize: textSizes.sm,
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
				xlText: {
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
						fontSize: textSizes.xl,
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
