import { Tabs } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { CustomizeTab, tabs, TemplateTab } from './tabs';

export const SettingsDesignPanel: React.FC<TSettingsDesignPanelProps> = (props) => {
	const { editor, order } = props;

	const [tabIndex, setTabIndex] = React.useState(0);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			const width = rect.right - rect.left;
			if (width <= 0) {
				// Note: Return default sizes instead of null to prevent the panel from being hidden on hot reload
				return {
					minSize: 20,
					defaultSize: 30,
					maxSize: 40
				};
			}

			const toPercent = (pixels: number) => (pixels / width) * 100;

			return {
				minSize: toPercent(300), // ~ 20
				defaultSize: toPercent(450), // ~ 30
				maxSize: toPercent(600) // ~ 40
			};
		},
		[],
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
					{tabIndex === 0 && <TemplateTab editor={editor} />}
					{tabIndex === 1 && <CustomizeTab editor={editor} />}
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsDesignPanelProps {
	editor: TPageEditor;
	order: number;
}
