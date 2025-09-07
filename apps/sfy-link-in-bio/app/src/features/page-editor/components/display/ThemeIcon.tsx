import { TTheme } from '@repo/editor';
import React from 'react';

export const ThemeIcon: React.FC<TThemeIconProps> = (props) => {
	const { theme } = props;

	return (
		<div
			className="grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
			style={{ backgroundColor: theme.color.base100 }}
		>
			<div
				className="size-1.5 rounded-full"
				style={{ backgroundColor: theme.color.baseContent }}
				title="Primary"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{ backgroundColor: theme.color.primary }}
				title="Secondary"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{ backgroundColor: theme.color.secondary }}
				title="Neutral"
			/>
			<div
				className="size-1.5 rounded-full"
				style={{ backgroundColor: theme.color.accent }}
				title="Accent"
			/>
		</div>
	);
};

interface TThemeIconProps {
	theme: TTheme;
}
