import { themeMetadata, TTheme } from '../environment';
import { TToken } from '../types';

export function createTokensFromTheme(theme: TTheme): TToken[] {
	const { color, typography, gap = 24, size = {}, radius, effects } = theme;
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

		// Color tokens
		{
			type: 'solid-paint',
			key: 'paint.base100',
			value: { type: 'solid', color: color.base100 }
		},
		{
			type: 'solid-paint',
			key: 'paint.base100.content',
			value: { type: 'solid', color: color.base100Content }
		},
		{
			type: 'solid-paint',
			key: 'paint.base200',
			value: { type: 'solid', color: color.base200 }
		},
		{
			type: 'solid-paint',
			key: 'paint.base200.content',
			value: { type: 'solid', color: color.base200Content }
		},
		{
			type: 'solid-paint',
			key: 'paint.base300',
			value: { type: 'solid', color: color.base300 }
		},
		{
			type: 'solid-paint',
			key: 'paint.base300.content',
			value: { type: 'solid', color: color.base300Content }
		},
		{
			type: 'solid-paint',
			key: 'paint.primary',
			value: { type: 'solid', color: color.primary }
		},
		{
			type: 'solid-paint',
			key: 'paint.primary.content',
			value: { type: 'solid', color: color.primaryContent }
		},
		{
			type: 'solid-paint',
			key: 'paint.secondary',
			value: { type: 'solid', color: color.secondary }
		},
		{
			type: 'solid-paint',
			key: 'paint.secondary.content',
			value: { type: 'solid', color: color.secondaryContent }
		},
		{
			type: 'solid-paint',
			key: 'paint.neutral',
			value: { type: 'solid', color: color.neutral }
		},
		{
			type: 'solid-paint',
			key: 'paint.neutral.content',
			value: { type: 'solid', color: color.neutralContent }
		},
		{
			type: 'solid-paint',
			key: 'paint.accent',
			value: { type: 'solid', color: color.accent }
		},
		{
			type: 'solid-paint',
			key: 'paint.accent.content',
			value: { type: 'solid', color: color.accentContent }
		},
		{
			type: 'solid-paint',
			key: 'paint.info',
			value: { type: 'solid', color: color.info }
		},
		{
			type: 'solid-paint',
			key: 'paint.info.content',
			value: { type: 'solid', color: color.infoContent }
		},
		{
			type: 'solid-paint',
			key: 'paint.success',
			value: { type: 'solid', color: color.success }
		},
		{
			type: 'solid-paint',
			key: 'paint.success.content',
			value: { type: 'solid', color: color.successContent }
		},
		{
			type: 'solid-paint',
			key: 'paint.warning',
			value: { type: 'solid', color: color.warning }
		},
		{
			type: 'solid-paint',
			key: 'paint.warning.content',
			value: { type: 'solid', color: color.warningContent }
		},
		{
			type: 'solid-paint',
			key: 'paint.error',
			value: { type: 'solid', color: color.error }
		},
		{
			type: 'solid-paint',
			key: 'paint.error.content',
			value: { type: 'solid', color: color.errorContent }
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
				horizontalPadding: { type: 'token', key: 'size.box.lg', tokenType: 'number' },
				verticalPadding: { type: 'token', key: 'size.box.lg', tokenType: 'number' },
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
				fontSize: { type: 'token', key: 'size.text.md', tokenType: 'number' },
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
				paint: { type: 'token', key: 'paint.base100', tokenType: 'paint' },
				opacity: 1
			}
		},
		{
			type: 'stroke',
			key: 'stroke.default',
			value:
				effects?.stroke != null
					? {
							paint: { type: 'token', key: 'paint.accent', tokenType: 'paint' },
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
							paint: { type: 'solid', color: { ...color.base200Content, a: 0.1 } },
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
					fontSize: { type: 'token', key: 'size.text.md', tokenType: 'number' },
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: { type: 'auto' },
					letterSpacing: { type: 'auto' }
				},
				fill: {
					paint: {
						type: 'token',
						key: 'paint.base100.content',
						tokenType: 'paint'
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
					fontSize: { type: 'token', key: 'size.text.lg', tokenType: 'number' },
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: { type: 'auto' },
					letterSpacing: { type: 'auto' }
				},
				fill: {
					paint: {
						type: 'token',
						key: 'paint.base100.content',
						tokenType: 'paint'
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
					fontSize: { type: 'token', key: 'size.text.sm', tokenType: 'number' },
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: { type: 'auto' },
					letterSpacing: { type: 'auto' }
				},
				fill: {
					paint: {
						type: 'token',
						key: 'paint.base100.content',
						tokenType: 'paint'
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
					borderRadius: { type: 'token', key: 'radius.field', tokenType: 'number' }
				},
				fill: {
					paint: {
						type: 'token',
						key: 'paint.primary',
						tokenType: 'paint'
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
						fontSize: { type: 'token', key: 'size.text.md', tokenType: 'number' },
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'token',
							key: 'paint.primary.content',
							tokenType: 'paint'
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
					borderRadius: { type: 'token', key: 'radius.field', tokenType: 'number' }
				},
				fill: {
					paint: {
						type: 'token',
						key: 'paint.neutral',
						tokenType: 'paint'
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
						fontSize: { type: 'token', key: 'size.text.md', tokenType: 'number' },
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'token',
							key: 'paint.neutral.content',
							tokenType: 'paint'
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
			key: 'badge.secondary',
			value: {
				appearance: {
					visible: true,
					opacity: 1,
					borderRadius: { type: 'token', key: 'radius.selector', tokenType: 'number' }
				},
				fill: {
					paint: {
						type: 'token',
						key: 'paint.secondary',
						tokenType: 'paint'
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
						fontSize: { type: 'token', key: 'size.text.sm', tokenType: 'number' },
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'token',
							key: 'paint.secondary.content',
							tokenType: 'paint'
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
					borderRadius: { type: 'token', key: 'radius.selector', tokenType: 'number' }
				},
				fill: {
					paint: {
						type: 'token',
						key: 'paint.neutral',
						tokenType: 'paint'
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
						fontSize: { type: 'token', key: 'size.text.sm', tokenType: 'number' },
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'token',
							key: 'paint.neutral.content',
							tokenType: 'paint'
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
					borderRadius: { type: 'token', key: 'radius.box', tokenType: 'number' }
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
					borderRadius: { type: 'token', key: 'radius.box', tokenType: 'number' }
				},
				fill: {
					paint: {
						type: 'token',
						key: 'paint.base100',
						tokenType: 'paint'
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
						fontSize: { type: 'token', key: 'size.text.xl', tokenType: 'number' },
						textAlignHorizontal: 'start',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'token',
							key: 'paint.base100.content',
							tokenType: 'paint'
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
						fontSize: { type: 'token', key: 'size.text.md', tokenType: 'number' },
						textAlignHorizontal: 'start',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'token',
							key: 'paint.base100.content',
							tokenType: 'paint'
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
						borderRadius: { type: 'token', key: 'radius.box', tokenType: 'number' }
					},
					stroke: null,
					shadow: null
				}
			}
		}
	];
}
