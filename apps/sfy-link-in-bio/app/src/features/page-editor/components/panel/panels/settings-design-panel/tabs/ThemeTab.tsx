import { themes } from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { TPageEditor } from '../../../../../lib';
import { ThemeIcon, ThemePreview } from '../../../../display';
import { applyTheme } from '../apply-theme';

export const ThemeTab: React.FC<TThemeTabProps> = (props) => {
	const { editor } = props;

	return (
		<div className="grid grid-cols-2 gap-3 p-4">
			{themes.map((theme) => (
				<div
					key={theme.key}
					className="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-gray-300 hover:shadow-sm"
					onClick={() => applyTheme(theme, editor)}
				>
					{/* Header with colors, name, and apply badge */}
					<div className="mb-3 flex items-center gap-2">
						<ThemeIcon theme={theme} />

						<Text as="p" variant="bodySm" fontWeight="medium">
							{theme.name}
						</Text>
					</div>

					{/* Preview */}
					<ThemePreview theme={theme} />
				</div>
			))}
		</div>
	);
};

interface TThemeTabProps {
	editor: TPageEditor;
}
