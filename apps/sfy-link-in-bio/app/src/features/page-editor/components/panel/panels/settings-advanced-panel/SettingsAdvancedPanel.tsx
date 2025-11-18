import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { ResizablePanel } from '@/components';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { OverrideWithExternalSiteSection } from './sections';

export const SettingsAdvancedPanel: React.FC<TSettingsAdvancedPanelProps> = (props) => {
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
				const toPercent = (pixels: number) => (pixels / width) * 100;
				return {
					minSize: toPercent(405)
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
			id="settings-advanced-panel"
			order={order}
			minSize={sizes.minSize}
			className="relative"
		>
			<div className="flex h-full flex-col overflow-y-auto bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						Advanced
					</Text>
				</PanelHeader>

				<div className="h-full flex-1 overflow-y-auto p-4">
					<div className="mx-auto w-full max-w-7xl space-y-6">
						<OverrideWithExternalSiteSection
							title="Override with External Site"
							description="Replace your current page content with content from an external site."
							helpText="This will parse the external site and completely override your current page content."
							editor={editor}
						/>
					</div>
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsAdvancedPanelProps {
	editor: TPageEditor;
	order: number;
}
