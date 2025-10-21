import { getFontMetadataByFamily, rgbaToHex, TTheme } from '@repo/editor';
import React from 'react';

export const ThemePreview: React.FC<TThemePreviewProps> = (props) => {
	const {
		theme: { paint, typography, radius, effects }
	} = props;

	const fontDisplayMetadata = React.useMemo(
		() => getFontMetadataByFamily(typography.display.fontFamily),
		[typography.display.fontFamily]
	);
	const fontBodyMetadata = React.useMemo(
		() => getFontMetadataByFamily(typography.body.fontFamily),
		[typography.body.fontFamily]
	);
	const headingFontUrl = React.useMemo(
		() =>
			fontDisplayMetadata?.googleFont != null
				? `https://fonts.googleapis.com/css2?family=${fontDisplayMetadata.googleFont}&display=swap`
				: null,
		[fontDisplayMetadata]
	);
	const textFontUrl = React.useMemo(
		() =>
			fontBodyMetadata?.googleFont != null
				? `https://fonts.googleapis.com/css2?family=${fontBodyMetadata.googleFont}&display=swap`
				: null,
		[fontBodyMetadata]
	);

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
					backgroundColor:
						paint.base200.type === 'solid' ? rgbaToHex(paint.base200.color) : '#000000',
					borderColor: 'rgba(0,0,0,0.1)',
					minHeight: '80px'
				}}
			>
				{/* Card preview */}
				<div
					className="flex flex-wrap items-center justify-center gap-1 rounded p-2"
					style={{
						backgroundColor:
							paint.base100.type === 'solid' ? rgbaToHex(paint.base100.color) : '#000000',
						borderRadius: `${radius.box}px`,
						border:
							effects?.stroke != null
								? `${effects.stroke.width}px solid ${rgbaToHex(paint.accent.color)}`
								: 'none',
						boxShadow:
							effects?.shadow != null
								? `${effects.shadow.offsetX}px ${effects.shadow.offsetY}px ${effects.shadow.blur}px ${effects.shadow.spread}px rgba(${paint.primary.color.r}, ${paint.primary.color.g}, ${paint.primary.color.b}, 0.15)`
								: 'none'
					}}
				>
					{/* Typography preview */}
					<h2
						style={{
							color: rgbaToHex(paint.base100Content.color),
							fontFamily: typography.display.fontFamily,
							fontSize: '20px',
							fontWeight: typography.display.fontWeight,
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
							backgroundColor: rgbaToHex(paint.primary.color),
							color: rgbaToHex(paint.primaryContent.color),
							fontFamily: typography.body.fontFamily,
							fontWeight: typography.body.fontWeight,
							borderRadius: `${radius.field}px`
						}}
					>
						Button
					</div>
				</div>
			</div>
		</>
	);
};

interface TThemePreviewProps {
	theme: TTheme;
}
