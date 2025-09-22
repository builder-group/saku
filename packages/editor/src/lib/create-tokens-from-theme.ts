import { themeMetadata, TTheme } from '../environment';
import { TToken } from '../types';
import { hexToRgba, isRgba } from './color';

export function createTokensFromTheme(theme: TTheme): TToken[] {
	const { color, typography, gap = 24, size = {}, radius, effects } = theme;
	const {
		text: textSize = themeMetadata.size.text.get(0),
		box: boxSize = themeMetadata.size.box.get(0)
		// field: fieldSize = themeMetadata.size.box.get(0),
		// selector: selectorSize = themeMetadata.size.box.get(0)
	} = size;

	// Convert colors
	const rgbaColors = {
		base100: isRgba(color.base100) ? color.base100 : hexToRgba(color.base100),
		base200: isRgba(color.base200) ? color.base200 : hexToRgba(color.base200),
		base300: isRgba(color.base300) ? color.base300 : hexToRgba(color.base300),
		baseContent: isRgba(color.baseContent) ? color.baseContent : hexToRgba(color.baseContent),
		primary: isRgba(color.primary) ? color.primary : hexToRgba(color.primary),
		primaryContent: isRgba(color.primaryContent)
			? color.primaryContent
			: hexToRgba(color.primaryContent),
		secondary: isRgba(color.secondary) ? color.secondary : hexToRgba(color.secondary),
		secondaryContent: isRgba(color.secondaryContent)
			? color.secondaryContent
			: hexToRgba(color.secondaryContent),
		neutral: isRgba(color.neutral) ? color.neutral : hexToRgba(color.neutral),
		neutralContent: isRgba(color.neutralContent)
			? color.neutralContent
			: hexToRgba(color.neutralContent),
		accent: isRgba(color.accent) ? color.accent : hexToRgba(color.accent),
		accentContent: isRgba(color.accentContent)
			? color.accentContent
			: hexToRgba(color.accentContent),
		info: isRgba(color.info) ? color.info : hexToRgba(color.info),
		infoContent: isRgba(color.infoContent) ? color.infoContent : hexToRgba(color.infoContent),
		success: isRgba(color.success) ? color.success : hexToRgba(color.success),
		successContent: isRgba(color.successContent)
			? color.successContent
			: hexToRgba(color.successContent),
		warning: isRgba(color.warning) ? color.warning : hexToRgba(color.warning),
		warningContent: isRgba(color.warningContent)
			? color.warningContent
			: hexToRgba(color.warningContent),
		error: isRgba(color.error) ? color.error : hexToRgba(color.error),
		errorContent: isRgba(color.errorContent) ? color.errorContent : hexToRgba(color.errorContent)
	};

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
			value: rgbaColors.base100
		},
		{
			type: 'variable',
			key: 'color.base200',
			value: rgbaColors.base200
		},
		{
			type: 'variable',
			key: 'color.base300',
			value: rgbaColors.base300
		},
		{
			type: 'variable',
			key: 'color.baseContent',
			value: rgbaColors.baseContent
		},
		{
			type: 'variable',
			key: 'color.primary',
			value: rgbaColors.primary
		},
		{
			type: 'variable',
			key: 'color.primaryContent',
			value: rgbaColors.primaryContent
		},
		{
			type: 'variable',
			key: 'color.secondary',
			value: rgbaColors.secondary
		},
		{
			type: 'variable',
			key: 'color.secondaryContent',
			value: rgbaColors.secondaryContent
		},
		{
			type: 'variable',
			key: 'color.neutral',
			value: rgbaColors.neutral
		},
		{
			type: 'variable',
			key: 'color.neutralContent',
			value: rgbaColors.neutralContent
		},
		{
			type: 'variable',
			key: 'color.accent',
			value: rgbaColors.accent
		},
		{
			type: 'variable',
			key: 'color.accentContent',
			value: rgbaColors.accentContent
		},
		{
			type: 'variable',
			key: 'color.info',
			value: rgbaColors.info
		},
		{
			type: 'variable',
			key: 'color.infoContent',
			value: rgbaColors.infoContent
		},
		{
			type: 'variable',
			key: 'color.success',
			value: rgbaColors.success
		},
		{
			type: 'variable',
			key: 'color.successContent',
			value: rgbaColors.successContent
		},
		{
			type: 'variable',
			key: 'color.warning',
			value: rgbaColors.warning
		},
		{
			type: 'variable',
			key: 'color.warningContent',
			value: rgbaColors.warningContent
		},
		{
			type: 'variable',
			key: 'color.error',
			value: rgbaColors.error
		},
		{
			type: 'variable',
			key: 'color.errorContent',
			value: rgbaColors.errorContent
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
				verticalPadding: boxSizes.lg,
				horizontalGap: null,
				verticalGap: null
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
					color: rgbaColors.base100
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
							color: rgbaColors.accent,
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
							color: { ...rgbaColors.baseContent, a: 0.1 },
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
					opacity: 1,
					borderRadius: null
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
						color: rgbaColors.baseContent
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
					opacity: 1,
					borderRadius: null
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
						color: rgbaColors.baseContent
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
					opacity: 1,
					borderRadius: null
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
						color: rgbaColors.baseContent
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
						color: rgbaColors.primary
					},
					opacity: 1
				},
				stroke: null,
				shadow: null,
				text: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: null
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
							color: rgbaColors.primaryContent
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
			key: 'neutral',
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
						color: rgbaColors.neutral
					},
					opacity: 1
				},
				stroke: null,
				shadow: null,
				text: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: null
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
							color: rgbaColors.neutralContent
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
			key: 'primary',
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
						color: rgbaColors.secondary
					},
					opacity: 1
				},
				stroke: null,
				shadow: null,
				text: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: null
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
							color: rgbaColors.secondaryContent
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
			key: 'neutral',
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
						color: rgbaColors.neutral
					},
					opacity: 1
				},
				stroke: null,
				shadow: null,
				text: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: null
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
							color: rgbaColors.neutralContent
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
						color: rgbaColors.base100
					},
					opacity: 1
				},
				stroke: null,
				shadow: null,
				textXl: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: null
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
							color: rgbaColors.baseContent
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				},
				text: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: null
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
							color: rgbaColors.baseContent
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				},
				buttonPrimary: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: radius.field
					},
					fill: {
						paint: {
							type: 'solid',
							color: rgbaColors.primary
						},
						opacity: 1
					},
					stroke: null,
					shadow: null,
					text: {
						appearance: {
							visible: true,
							opacity: 1,
							borderRadius: null
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
								color: rgbaColors.primaryContent
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
