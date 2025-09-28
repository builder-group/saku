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
				title="Base 100 Content"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.color.primary)
				}}
				title="Primary"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{
					backgroundColor: rgbaToHex(theme.color.secondary)
				}}
				title="Secondary"
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
