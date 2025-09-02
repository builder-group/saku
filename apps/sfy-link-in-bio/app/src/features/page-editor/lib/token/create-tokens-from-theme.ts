import { hexToRgba, TToken } from '@repo/editor';
import { TTheme } from '../../environment';

export function createTokensFromTheme(theme: TTheme): TToken[] {
	const { colors, typography, spacing } = theme;

	return [
		// Variable tokens (atomic design values)
		{
			type: 'variable',
			key: 'color.primary',
			name: 'Primary Color',
			value: colors.primary
		},
		{
			type: 'variable',
			key: 'color.secondary',
			name: 'Secondary Color',
			value: colors.secondary
		},
		{
			type: 'variable',
			key: 'color.surface',
			name: 'Surface Color',
			value: colors.surface
		},
		{
			type: 'variable',
			key: 'color.background',
			name: 'Background Color',
			value: colors.background
		},
		{
			type: 'variable',
			key: 'color.text',
			name: 'Text Color',
			value: colors.text
		},
		{
			type: 'variable',
			key: 'typography.fontFamily',
			name: 'Font Family',
			value: typography.fontFamily
		},
		{
			type: 'variable',
			key: 'typography.fontWeight',
			name: 'Font Weight',
			value: typography.fontWeight
		},
		{
			type: 'variable',
			key: 'typography.fontSize',
			name: 'Font Size',
			value: typography.fontSize
		},
		{
			type: 'variable',
			key: 'spacing.borderRadius',
			name: 'Border Radius',
			value: spacing.borderRadius
		},
		{
			type: 'variable',
			key: 'spacing.padding',
			name: 'Padding',
			value: spacing.padding
		},
		{
			type: 'variable',
			key: 'spacing.gap',
			name: 'Gap',
			value: spacing.gap
		},

		// Mixin tokens (component style definitions)
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'autoLayout',
			value: {
				horizontalPadding: spacing.padding,
				verticalPadding: spacing.padding
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'appearance',
			value: {
				visible: true,
				opacity: 1,
				borderRadius: spacing.borderRadius
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'typography',
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
			type: 'mixin',
			key: 'default',
			mixinKey: 'fill',
			value: {
				paint: {
					type: 'solid',
					color: hexToRgba(colors.surface)
				},
				opacity: 1
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'stroke',
			value: {
				color: hexToRgba(colors.secondary),
				width: 1
			}
		},
		{
			type: 'mixin',
			key: 'default',
			mixinKey: 'shadow',
			value: {
				color: { ...hexToRgba(colors.primary), a: 0.15 },
				offsetX: 0,
				offsetY: 4,
				blur: 12,
				spread: -2
			}
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
			type: 'mixin',
			key: 'default',
			mixinKey: 'button',
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
	];
}
