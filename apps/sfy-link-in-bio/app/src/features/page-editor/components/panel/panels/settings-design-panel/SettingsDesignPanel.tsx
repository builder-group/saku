import { Tabs } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { AdvancedTab, CustomizeTab, tabs, ThemeTab } from './tabs';

export const SettingsDesignPanel: React.FC<TSettingsDesignPanelProps> = (props) => {
	const { editor, order } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const [tabIndex, setTabIndex] = React.useState(0);

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
					minSize: toPercent(300), // ~ 20
					defaultSize: toPercent(405), // ~ 27
					maxSize: toPercent(525) // ~ 35
				};
			}

			// Mobile (vertical layout): Resizable based on height
			return {
				minSize: undefined,
				defaultSize: undefined,
				maxSize: undefined
			};
		},
		[isMd],
		{
			isEqual(a, b) {
				return (
					a.minSize === b.minSize && a.defaultSize === b.defaultSize && a.maxSize === b.maxSize
				);
			}
		}
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTabChange = React.useCallback((tabIndex: number) => {
		setTabIndex(tabIndex);
	}, []);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			id="settings-design-panel"
			order={order}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
		>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					{/* Offset 8px Tab padding which can't be removed */}
					<div className="-ml-2">
						<Tabs tabs={tabs} selected={tabIndex} onSelect={handleTabChange} />
					</div>
				</PanelHeader>
				<div className="flex-1 overflow-auto">
					{tabIndex === 0 && <ThemeTab editor={editor} />}
					{tabIndex === 1 && <CustomizeTab editor={editor} />}
					{tabIndex === 2 && <AdvancedTab editor={editor} />}
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsDesignPanelProps {
	editor: TPageEditor;
	order: number;
}
