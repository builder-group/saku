import { Icon, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { cn } from '@/lib';
import { TViewMetadata, TViewType, viewMetadataMap } from '../environment';
import { TPageEditor } from '../lib';

export const ViewNavPanel: React.FC<TViewNavPanelProps> = (props) => {
	const { editor } = props;
	const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
	const activeView = useFeatureState(editor.activeView);

	const navigationItems = React.useMemo<TViewMetadata[]>(() => {
		return [viewMetadataMap.layers, viewMetadataMap.settings];
	}, []);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(editor.boundingRect, (rect) => {
		const width = rect.right - rect.left;
		if (width <= 0) {
			// Note: Return default sizes instead of null to prevent the panel from being hidden on hot reload
			return {
				collapsedSize: 4,
				minSize: 8,
				defaultSize: 4,
				maxSize: 12
			};
		}

		const toPercent = (pixels: number) => (pixels / width) * 100;

		return {
			collapsedSize: toPercent(60), // ~ 4
			minSize: toPercent(120), // ~ 8
			defaultSize: toPercent(60), // ~ 4
			maxSize: toPercent(180) // ~ 12
		};
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleSwitchView = React.useCallback(
		(view: TViewType) => {
			editor.switchView(view);
		},
		[editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			collapsible={true}
			collapsedSize={sizes.collapsedSize}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
			onCollapse={() => setSidebarCollapsed(true)}
			onExpand={() => setSidebarCollapsed(false)}
		>
			<div className="flex h-full flex-col bg-white">
				<nav className="flex flex-col gap-1 p-2">
					{navigationItems.map((item, index) => {
						return (
							<button
								key={index}
								className={cn(
									'flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left text-neutral-700 hover:bg-neutral-50',
									activeView === item.type && 'bg-neutral-100 text-[#005BD3]'
								)}
								onClick={() => handleSwitchView(item.type as TViewType)}
							>
								<div className="flex h-5 w-5 items-center justify-center">
									<Icon source={item.icon} />
								</div>
								{!sidebarCollapsed && (
									<Text as="span" variant="bodyMd" truncate>
										{item.label}
									</Text>
								)}
							</button>
						);
					})}
				</nav>
			</div>
		</ResizablePanel>
	);
};

interface TViewNavPanelProps {
	editor: TPageEditor;
}
