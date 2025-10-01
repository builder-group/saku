import { themeMetadata, TTheme } from '../environment';
import { TToken } from '../types';
import { tokenRef } from './token-ref';

export function createTokensFromTheme(theme: TTheme): TToken[] {
	const { paint, typography, gap = 24, size = {}, radius, effects } = theme;
	const {
		text: textSize = themeMetadata.size.text.get(0),
		box: boxSize = themeMetadata.size.box.get(0)
		// field: fieldSize = themeMetadata.size.box.get(0),
		// selector: selectorSize = themeMetadata.size.box.get(0)
	} = size;

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

		// Paint tokens
		{
			type: 'paint',
			key: 'paint.base100',
			value: paint.base100
		},
		{
			type: 'paint.solid',
			key: 'paint.base100.content',
			value: paint.base100Content
		},
		{
			type: 'paint',
			key: 'paint.base200',
			value: paint.base200
		},
		{
			type: 'paint.solid',
			key: 'paint.base200.content',
			value: paint.base200Content
		},
		{
			type: 'paint',
			key: 'paint.base300',
			value: paint.base300
		},
		{
			type: 'paint.solid',
			key: 'paint.base300.content',
			value: paint.base300Content
		},
		{
			type: 'paint.solid',
			key: 'paint.primary',
			value: paint.primary
		},
		{
			type: 'paint.solid',
			key: 'paint.primary.content',
			value: paint.primaryContent
		},
		{
			type: 'paint.solid',
			key: 'paint.secondary',
			value: paint.secondary
		},
		{
			type: 'paint.solid',
			key: 'paint.secondary.content',
			value: paint.secondaryContent
		},
		{
			type: 'paint.solid',
			key: 'paint.neutral',
			value: paint.neutral
		},
		{
			type: 'paint.solid',
			key: 'paint.neutral.content',
			value: paint.neutralContent
		},
		{
			type: 'paint.solid',
			key: 'paint.accent',
			value: paint.accent
		},
		{
			type: 'paint.solid',
			key: 'paint.accent.content',
			value: paint.accentContent
		},
		{
			type: 'paint.solid',
			key: 'paint.info',
			value: paint.info
		},
		{
			type: 'paint.solid',
			key: 'paint.info.content',
			value: paint.infoContent
		},
		{
			type: 'paint.solid',
			key: 'paint.success',
			value: paint.success
		},
		{
			type: 'paint.solid',
			key: 'paint.success.content',
			value: paint.successContent
		},
		{
			type: 'paint.solid',
			key: 'paint.warning',
			value: paint.warning
		},
		{
			type: 'paint.solid',
			key: 'paint.warning.content',
			value: paint.warningContent
		},
		{
			type: 'paint.solid',
			key: 'paint.error',
			value: paint.error
		},
		{
			type: 'paint.solid',
			key: 'paint.error.content',
			value: paint.errorContent
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
			key: 'size.text.xs',
			value: textSize * themeMetadata.size.text.xs
		},
		{
			type: 'number',
			key: 'size.text.sm',
			value: textSize * themeMetadata.size.text.sm
		},
		{
			type: 'number',
			key: 'size.text.md',
			value: textSize * themeMetadata.size.text.md
		},
		{
			type: 'number',
			key: 'size.text.lg',
			value: textSize * themeMetadata.size.text.lg
		},
		{
			type: 'number',
			key: 'size.text.xl',
			value: textSize * themeMetadata.size.text.xl
		},
		{
			type: 'number',
			key: 'size.box',
			value: boxSize
		},
		{
			type: 'number',
			key: 'size.box.xs',
			value: boxSize * themeMetadata.size.box.xs
		},
		{
			type: 'number',
			key: 'size.box.sm',
			value: boxSize * themeMetadata.size.box.sm
		},
		{
			type: 'number',
			key: 'size.box.md',
			value: boxSize * themeMetadata.size.box.md
		},
		{
			type: 'number',
			key: 'size.box.lg',
			value: boxSize * themeMetadata.size.box.lg
		},
		{
			type: 'number',
			key: 'size.box.xl',
			value: boxSize * themeMetadata.size.box.xl
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
				horizontalPadding: tokenRef('size.box.lg', 'number'),
				verticalPadding: tokenRef('size.box.lg', 'number'),
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
				borderRadius: tokenRef('radius.box', 'number')
			}
		},
		{
			type: 'typography',
			key: 'typography.default',
			value: {
				font: tokenRef('font.text', 'font'),
				fontSize: tokenRef('size.text.md', 'number'),
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
				paint: tokenRef('paint.base100', 'paint'),
				opacity: 1
			}
		},
		{
			type: 'stroke',
			key: 'stroke.default',
			value:
				effects?.stroke != null
					? {
							paint: tokenRef('paint.base200.content', 'paint.solid'),
							width: tokenRef('effects.stroke.width', 'number')
						}
					: null
		},
		{
			type: 'shadow',
			key: 'shadow.default',
			value:
				effects?.shadow != null
					? {
							paint: {
								type: 'solid',
								color: {
									...paint.base200Content.color,
									a: 0.1
								}
							},
							offsetX: tokenRef('effects.shadow.offsetX', 'number'),
							offsetY: tokenRef('effects.shadow.offsetY', 'number'),
							blur: tokenRef('effects.shadow.blur', 'number'),
							spread: tokenRef('effects.shadow.spread', 'number')
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
					font: tokenRef('font.text', 'font'),
					fontSize: tokenRef('size.text.md', 'number'),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: { type: 'auto' },
					letterSpacing: { type: 'auto' }
				},
				fill: {
					paint: tokenRef('paint.base100.content', 'paint'),
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
					font: tokenRef('font.heading', 'font'),
					fontSize: tokenRef('size.text.lg', 'number'),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: { type: 'auto' },
					letterSpacing: { type: 'auto' }
				},
				fill: {
					paint: tokenRef('paint.base100.content', 'paint'),
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
					font: tokenRef('font.text', 'font'),
					fontSize: tokenRef('size.text.sm', 'number'),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: { type: 'auto' },
					letterSpacing: { type: 'auto' }
				},
				fill: {
					paint: tokenRef('paint.base100.content', 'paint'),
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
					borderRadius: tokenRef('radius.field', 'number')
				},
				fill: {
					paint: tokenRef('paint.primary', 'paint'),
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
						font: tokenRef('font.text', 'font'),
						fontSize: tokenRef('size.text.md', 'number'),
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: tokenRef('paint.primary.content', 'paint'),
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
					borderRadius: tokenRef('radius.field', 'number')
				},
				fill: {
					paint: tokenRef('paint.neutral', 'paint'),
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
						font: tokenRef('font.text', 'font'),
						fontSize: tokenRef('size.text.md', 'number'),
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: tokenRef('paint.neutral.content', 'paint'),
						opacity: 1
					},
					stroke: null,
					shadow: null
				}
			}
		},
		{
			type: 'badge',
			key: 'badge.secondary',
			value: {
				appearance: {
					visible: true,
					opacity: 1,
					borderRadius: tokenRef('radius.selector', 'number')
				},
				fill: {
					paint: tokenRef('paint.secondary', 'paint'),
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
						font: tokenRef('font.text', 'font'),
						fontSize: tokenRef('size.text.sm', 'number'),
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: tokenRef('paint.secondary.content', 'paint'),
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
					borderRadius: tokenRef('radius.selector', 'number')
				},
				fill: {
					paint: tokenRef('paint.neutral', 'paint'),
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
						font: tokenRef('font.text', 'font'),
						fontSize: tokenRef('size.text.sm', 'number'),
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: tokenRef('paint.neutral.content', 'paint'),
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
					borderRadius: tokenRef('radius.box', 'number')
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
					borderRadius: tokenRef('radius.box', 'number')
				},
				fill: {
					paint: tokenRef('paint.base100', 'paint'),
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
						font: tokenRef('font.heading', 'font'),
						fontSize: tokenRef('size.text.xl', 'number'),
						textAlignHorizontal: 'start',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: tokenRef('paint.base100.content', 'paint'),
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
						font: tokenRef('font.text', 'font'),
						fontSize: tokenRef('size.text.md', 'number'),
						textAlignHorizontal: 'start',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: tokenRef('paint.base100.content', 'paint'),
						opacity: 1
					},
					stroke: null,
					shadow: null
				},
				buttonPrimary: tokenRef('button.primary', 'button'),
				image: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: tokenRef('radius.box', 'number')
					},
					stroke: null,
					shadow: null
				}
			}
		}
	];
}
