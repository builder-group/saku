import { Icon } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { cn } from '@/lib';
import { TViewMetadata, TViewType, viewsMetadataMap } from '../environment';
import { TEditor } from '../lib';

export const ViewNavPanel: React.FC<TViewNavPanelProps> = (props) => {
	const { editor } = props;
	const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
	const activeView = useFeatureState(editor.activeView);

	const navigationItems = React.useMemo<TViewMetadata[]>(() => {
		return [viewsMetadataMap.blocks, viewsMetadataMap.settings];
	}, []);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(editor.boundingRect, (rect) => {
		const width = rect.right - rect.left;
		if (width <= 0) {
			return null;
		}

		const toPercent = (pixels: number) => (pixels / width) * 100;

		return {
			collapsedSize: toPercent(60), // ~ 4
			minSize: toPercent(120), // ~ 8
			defaultSize: toPercent(60), // ~ 4
			maxSize: toPercent(180) // ~ 12
		};
	});

	if (sizes == null) {
		return null;
	}

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
						const IconComponent = item.icon;
						return (
							<button
								key={index}
								className={cn(
									'group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left text-gray-700 transition-colors hover:bg-gray-100',
									activeView === item.type && 'bg-gray-100 text-[#005BD3]'
								)}
								onClick={() => editor.activeView.set(item.type as TViewType)}
							>
								<div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
									<Icon source={IconComponent} />
								</div>
								{!sidebarCollapsed && (
									<span className={'truncate text-sm font-medium'}>{item.label}</span>
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
	editor: TEditor;
}
