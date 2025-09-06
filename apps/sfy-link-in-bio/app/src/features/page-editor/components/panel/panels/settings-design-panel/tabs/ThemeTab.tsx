import { getFontMetadataByFamily, hexToRgba, themes, TTheme } from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { TPageEditor } from '../../../../../lib';
import { applyTheme } from '../apply-theme';

export const ThemeTab: React.FC<TThemeTabProps> = (props) => {
	const { editor } = props;

	const renderTemplatePreview = React.useCallback((template: TTheme) => {
		const { color, typography, radius, effects } = template;
		const primaryColor = hexToRgba(color.primary);
		const headingFontMetadata = getFontMetadataByFamily(typography.heading.fontFamily);
		const textFontMetadata = getFontMetadataByFamily(typography.text.fontFamily);
		const headingFontUrl =
			headingFontMetadata?.googleFont != null
				? `https://fonts.googleapis.com/css2?family=${headingFontMetadata.googleFont}&display=swap`
				: null;
		const textFontUrl =
			textFontMetadata?.googleFont != null
				? `https://fonts.googleapis.com/css2?family=${textFontMetadata.googleFont}&display=swap`
				: null;

		return (
			<>
				{/* Dynamic font loading */}
				{(headingFontUrl != null || textFontUrl != null) && (
					<style>
						{headingFontUrl != null && `@import url('${headingFontUrl}');`}
						{textFontUrl != null && `@import url('${textFontUrl}');`}
					</style>
				)}

				<div
					className="flex items-center justify-center rounded-lg border p-1"
					style={{
						backgroundColor: color.base200,
						borderColor: 'rgba(0,0,0,0.1)',
						minHeight: '80px'
					}}
				>
					{/* Card preview */}
					<div
						className="flex flex-wrap items-center justify-center gap-1 rounded p-2"
						style={{
							backgroundColor: color.base100,
							borderRadius: `${radius.box}px`,
							border:
								effects?.stroke != null
									? `${effects.stroke.width}px solid ${color.accent}`
									: 'none',
							boxShadow:
								effects?.shadow != null
									? `${effects.shadow.offsetX}px ${effects.shadow.offsetY}px ${effects.shadow.blur}px ${effects.shadow.spread}px rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.15)`
									: 'none'
						}}
					>
						{/* Typography preview */}
						<h2
							style={{
								color: color.baseContent,
								fontFamily: typography.heading.fontFamily,
								fontSize: '20px',
								fontWeight: typography.heading.fontWeight,
								lineHeight: 1,
								margin: 0
							}}
						>
							Aa
						</h2>

						{/* Button preview */}
						<div
							className="rounded px-3 py-1 text-sm font-medium"
							style={{
								backgroundColor: color.primary,
								color: color.primaryContent,
								fontFamily: typography.text.fontFamily,
								fontWeight: typography.text.fontWeight,
								borderRadius: `${radius.field}px`
							}}
						>
							Button
						</div>
					</div>
				</div>
			</>
		);
	}, []);

	return (
		<div className="grid grid-cols-2 gap-3 p-4">
			{themes.map((template) => (
				<div
					key={template.key}
					className="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-gray-300 hover:shadow-sm"
					onClick={() => applyTheme(template, editor)}
				>
					{/* Header with colors, name, and apply badge */}
					<div className="mb-3 flex items-center gap-2">
						{/* Color palette grid */}
						<div
							className="grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
							style={{ backgroundColor: template.color.base100 }}
						>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.color.baseContent }}
								title="Primary"
							/>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.color.primary }}
								title="Secondary"
							/>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.color.secondary }}
								title="Neutral"
							/>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: template.color.accent }}
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

interface TThemeTabProps {
	editor: TPageEditor;
}
