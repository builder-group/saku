import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { ResizablePanel } from '@/components';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';

export const SettingsGeneralPanel: React.FC<TSettingsGeneralPanelProps> = (props) => {
	const { editor, order } = props;

	const isMd = useEditorBreakpoint(editor, 'md');

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			// Desktop (horizontal layout): Resizable based on width
			if (isMd) {
				const width = rect.right - rect.left;
				const toPercent = (pixels: number) => (pixels / (width > 0 ? width : 15)) * 100;
				return {
					minSize: toPercent(405) // ~ 27
				};
			}

			// Mobile (vertical layout): Resizable based on height
			return {
				minSize: undefined
			};
		},
		[isMd],
		{
			isEqual(a, b) {
				return a.minSize === b.minSize;
			}
		}
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			id="settings-general-panel"
			order={order}
			minSize={sizes.minSize}
			className="relative"
		>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						General
					</Text>
				</PanelHeader>
				todo - Name - Slug - Id (just copy) - Delete Site
			</div>
		</ResizablePanel>
	);
};

interface TSettingsGeneralPanelProps {
	editor: TPageEditor;
	order: number;
}
