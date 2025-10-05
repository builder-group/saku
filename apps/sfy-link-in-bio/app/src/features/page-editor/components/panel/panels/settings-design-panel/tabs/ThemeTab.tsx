import { themes } from '@repo/editor';
import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { useCurrentPlan } from '@/hooks';
import { TPageEditor } from '../../../../../lib';
import { ThemeIcon, ThemePreview } from '../../../../display';
import { applyTheme } from '../apply-theme';

export const ThemeTab: React.FC<TThemeTabProps> = (props) => {
	const { editor } = props;

	const currentThemeKey = useCompute(editor.tokenMap, ({ value }) => value['theme.key']?.value);
	const currentPlan = useCurrentPlan();

	return (
		<div className="grid grid-cols-2 gap-3 p-4">
			{themes.map((theme) => {
				const isSelected = currentThemeKey === theme.key;

				return (
					<div
						key={theme.key}
						className={`group cursor-pointer rounded-lg border p-3 transition-all hover:shadow-sm ${
							isSelected
								? 'border-blue-500 bg-blue-50'
								: 'border-neutral-200 hover:border-neutral-300'
						}`}
						onClick={() => applyTheme(theme, editor)}
					>
						{/* Header with colors, name, and selection indicator */}
						<div className="mb-3 flex items-center gap-2">
							<ThemeIcon theme={theme} />

							<div className="flex-1 text-left">
								<Text as="p" variant="bodySm" fontWeight="medium">
									{theme.name}
								</Text>
							</div>

							{/* Selection indicator */}
							{isSelected && (
								<div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
									<div className="h-2 w-2 rounded-full bg-white" />
								</div>
							)}
						</div>

						{/* Preview */}
						<ThemePreview theme={theme} />
					</div>
				);
			})}
		</div>
	);
};

interface TThemeTabProps {
	editor: TPageEditor;
}
