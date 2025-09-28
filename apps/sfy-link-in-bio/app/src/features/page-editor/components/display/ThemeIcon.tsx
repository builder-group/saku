import { rgbaToHex, TTheme } from '@repo/editor';
import React from 'react';

export const ThemeIcon: React.FC<TThemeIconProps> = (props) => {
	const { theme } = props;

	return (
		<div
			className="grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
			style={{
				backgroundColor: rgbaToHex(theme.color.base100)
			}}
		>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.color.base100Content)
				}}
				title="Primary"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.color.primary)
				}}
				title="Secondary"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.color.neutral)
				}}
				title="Neutral"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.color.accent)
				}}
				title="Accent"
			/>
		</div>
	);
};

interface TThemeIconProps {
	theme: TTheme;
}
