import { rgbaToHex, TTheme } from '@repo/editor';
import React from 'react';

export const ThemeIcon: React.FC<TThemeIconProps> = (props) => {
	const { theme } = props;

	return (
		<div
			className="grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
			style={{
				backgroundColor:
					theme.paint.base100.type === 'solid' ? rgbaToHex(theme.paint.base100.color) : '#000000'
			}}
		>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.paint.base100Content.color)
				}}
				title="Base 100 Content"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.paint.primary.color)
				}}
				title="Primary"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.paint.secondary.color)
				}}
				title="Secondary"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.paint.accent.color)
				}}
				title="Accent"
			/>
		</div>
	);
};

interface TThemeIconProps {
	theme: TTheme;
}
