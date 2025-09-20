import { themeMetadata, TTheme } from '../environment';
import { TToken } from '../types';
import { hexToRgba } from './color';

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
		base100: hexToRgba(color.base100),
		base200: hexToRgba(color.base200),
		base300: hexToRgba(color.base300),
		baseContent: hexToRgba(color.baseContent),
		primary: hexToRgba(color.primary),
		primaryContent: hexToRgba(color.primaryContent),
		secondary: hexToRgba(color.secondary),
		secondaryContent: hexToRgba(color.secondaryContent),
		neutral: hexToRgba(color.neutral),
		neutralContent: hexToRgba(color.neutralContent),
		accent: hexToRgba(color.accent),
		accentContent: hexToRgba(color.accentContent),
		info: hexToRgba(color.info),
		infoContent: hexToRgba(color.infoContent),
		success: hexToRgba(color.success),
		successContent: hexToRgba(color.successContent),
		warning: hexToRgba(color.warning),
		warningContent: hexToRgba(color.warningContent),
		error: hexToRgba(color.error),
		errorContent: hexToRgba(color.errorContent)
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
			type: 'string',
			key: 'theme.key',
			value: theme.key
		},
		{
			type: 'string',
			key: 'theme.name',
			value: theme.name
		},

		// Color tokens
		{
			type: 'color',
			key: 'color.base100',
			value: rgbaColors.base100
		},
		{
			type: 'color',
			key: 'color.base200',
			value: rgbaColors.base200
		},
		{
			type: 'color',
			key: 'color.base300',
			value: rgbaColors.base300
		},
		{
			type: 'color',
			key: 'color.baseContent',
			value: rgbaColors.baseContent
		},
		{
			type: 'color',
			key: 'color.primary',
			value: rgbaColors.primary
		},
		{
			type: 'color',
			key: 'color.primaryContent',
			value: rgbaColors.primaryContent
		},
		{
			type: 'color',
			key: 'color.secondary',
			value: rgbaColors.secondary
		},
		{
			type: 'color',
			key: 'color.secondaryContent',
			value: rgbaColors.secondaryContent
		},
		{
			type: 'color',
			key: 'color.neutral',
			value: rgbaColors.neutral
		},
		{
			type: 'color',
			key: 'color.neutralContent',
			value: rgbaColors.neutralContent
		},
		{
			type: 'color',
			key: 'color.accent',
			value: rgbaColors.accent
		},
		{
			type: 'color',
			key: 'color.accentContent',
			value: rgbaColors.accentContent
		},
		{
			type: 'color',
			key: 'color.info',
			value: rgbaColors.info
		},
		{
			type: 'color',
			key: 'color.infoContent',
			value: rgbaColors.infoContent
		},
		{
			type: 'color',
			key: 'color.success',
			value: rgbaColors.success
		},
		{
			type: 'color',
			key: 'color.successContent',
			value: rgbaColors.successContent
		},
		{
			type: 'color',
			key: 'color.warning',
			value: rgbaColors.warning
		},
		{
			type: 'color',
			key: 'color.warningContent',
			value: rgbaColors.warningContent
		},
		{
			type: 'color',
			key: 'color.error',
			value: rgbaColors.error
		},
		{
			type: 'color',
			key: 'color.errorContent',
			value: rgbaColors.errorContent
		},

		// Font tokens
		{
			type: 'font',
			key: 'font.heading',
			value: {
				family: typography.heading.fontFamily,
				weight: typography.heading.fontWeight
			}
		},
		{
			type: 'font',
			key: 'font.text',
			value: {
				family: typography.text.fontFamily,
				weight: typography.text.fontWeight
			}
		},

		// Spacing tokens
		{
			type: 'number',
			key: 'spacing.gap',
			value: gap
		},

		// Size tokens
		{
			type: 'number',
			key: 'size.text',
			value: textSize
		},
		{
			type: 'number',
			key: 'size.box',
			value: boxSize
		},
		{
			type: 'number',
			key: 'size.field',
			value: size.field ?? themeMetadata.size.box.get(0)
		},
		{
			type: 'number',
			key: 'size.selector',
			value: size.selector ?? themeMetadata.size.box.get(0)
		},

		// Radius tokens
		{
			type: 'number',
			key: 'radius.box',
			value: radius.box
		},
		{
			type: 'number',
			key: 'radius.field',
			value: radius.field
		},
		{
			type: 'number',
			key: 'radius.selector',
			value: radius.selector
		},

		// Effects tokens
		{
			type: 'number',
			key: 'effects.stroke.width',
			value: effects?.stroke?.width ?? 0
		},
		{
			type: 'number',
			key: 'effects.shadow.blur',
			value: effects?.shadow?.blur ?? 0
		},
		{
			type: 'number',
			key: 'effects.shadow.offsetX',
			value: effects?.shadow?.offsetX ?? 0
		},
		{
			type: 'number',
			key: 'effects.shadow.offsetY',
			value: effects?.shadow?.offsetY ?? 0
		},
		{
			type: 'number',
			key: 'effects.shadow.spread',
			value: effects?.shadow?.spread ?? 0
		},

		// Mixin tokens (component style definitions)
		{
			type: 'auto-layout',
			key: 'auto-layout.default',
			value: {
				horizontalPadding: boxSizes.lg,
				verticalPadding: boxSizes.lg,
				horizontalGap: null,
				verticalGap: null
			}
		},
		{
			type: 'appearance',
			key: 'appearance.default',
			value: {
				visible: true,
				opacity: 1,
				borderRadius: radius.box
			}
		},
		{
			type: 'typography',
			key: 'typography.default',
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
			type: 'fill',
			key: 'fill.default',
			value: {
				paint: {
					type: 'solid',
					color: rgbaColors.base100
				},
				opacity: 1
			}
		},
		{
			type: 'stroke',
			key: 'stroke.default',
			value:
				effects?.stroke != null
					? {
							color: rgbaColors.accent,
							width: effects.stroke.width
						}
					: null
		},
		{
			type: 'shadow',
			key: 'shadow.default',
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
			type: 'text',
			key: 'text.default',
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
			type: 'text',
			key: 'text.xl',
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
			type: 'text',
			key: 'text.sm',
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
			type: 'button',
			key: 'button.primary',
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
			type: 'button',
			key: 'button.neutral',
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
			type: 'badge',
			key: 'badge.primary',
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
			type: 'badge',
			key: 'badge.neutral',
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
			type: 'image',
			key: 'image.default',
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
			type: 'product-details',
			key: 'product-details.default',
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
