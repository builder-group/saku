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
		base100Content: isRgba(color.base100Content)
			? color.base100Content
			: hexToRgba(color.base100Content),
		base200: isRgba(color.base200) ? color.base200 : hexToRgba(color.base200),
		base200Content: isRgba(color.base200Content)
			? color.base200Content
			: hexToRgba(color.base200Content),
		primary: isRgba(color.primary) ? color.primary : hexToRgba(color.primary),
		primaryContent: isRgba(color.primaryContent)
			? color.primaryContent
			: hexToRgba(color.primaryContent),
		// secondary: isRgba(color.secondary) ? color.secondary : hexToRgba(color.secondary),
		// secondaryContent: isRgba(color.secondaryContent)
		// 	? color.secondaryContent
		// 	: hexToRgba(color.secondaryContent),
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
			key: 'color.base100Content',
			value: rgbaColors.base100Content
		},
		{
			type: 'color',
			key: 'color.base200',
			value: rgbaColors.base200
		},
		{
			type: 'color',
			key: 'color.base200Content',
			value: rgbaColors.base200Content
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
		// {
		// 	type: 'color',
		// 	key: 'color.secondary',
		// 	value: rgbaColors.secondary
		// },
		// {
		// 	type: 'color',
		// 	key: 'color.secondaryContent',
		// 	value: rgbaColors.secondaryContent
		// },
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
				borderRadius: {
					type: 'token',
					key: 'radius.box',
					tokenType: 'number'
				}
			}
		},
		{
			type: 'typography',
			key: 'typography.default',
			value: {
				font: {
					type: 'token',
					key: 'font.text',
					tokenType: 'font'
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
							color: { ...rgbaColors.base200Content, a: 0.1 },
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
						type: 'token',
						key: 'font.text',
						tokenType: 'font'
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
						color: rgbaColors.base100Content
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
						type: 'token',
						key: 'font.heading',
						tokenType: 'font'
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
						color: rgbaColors.base100Content
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
						type: 'token',
						key: 'font.text',
						tokenType: 'font'
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
						color: rgbaColors.base100Content
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
							type: 'token',
							key: 'font.text',
							tokenType: 'font'
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
							type: 'token',
							key: 'font.text',
							tokenType: 'font'
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
						color: rgbaColors.accent
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
							type: 'token',
							key: 'font.text',
							tokenType: 'font'
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
							color: rgbaColors.accentContent
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
							type: 'token',
							key: 'font.text',
							tokenType: 'font'
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
							type: 'token',
							key: 'font.heading',
							tokenType: 'font'
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
							color: rgbaColors.base100Content
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
							type: 'token',
							key: 'font.text',
							tokenType: 'font'
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
							color: rgbaColors.base100Content
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				},
				buttonPrimary: {
					type: 'token',
					key: 'button.primary',
					tokenType: 'button'
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
