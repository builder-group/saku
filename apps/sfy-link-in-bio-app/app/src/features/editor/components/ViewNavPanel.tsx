import { Icon } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { cn } from '@/lib';
import { TView, TViewId, views } from '../environment';
import { TEditor } from '../lib';

export const ViewNavPanel: React.FC<TViewNavPanelProps> = (props) => {
	const { editor } = props;
	const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
	const activeView = useFeatureState(editor.activeView);

	const navigationItems = React.useMemo<TView[]>(() => {
		return [views.blocks, views.settings];
	}, []);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const { collapsedSize, minSize, defaultSize, maxSize } = useCompute(
		editor.boundingRect,
		(rect) => {
			const width = rect.right - rect.left;
			const logicalSizeUnits = {
				collapsedSize: 4,
				minSize: 8,
				defaultSize: 4,
				maxSize: 12
			};

			if (width <= 0) {
				return logicalSizeUnits;
			}

			const unitPixelValue = 15; // 1 unit = 15px
			const toPercentOfWidth = (unit: number) => ((unit * unitPixelValue) / width) * 100;

			return {
				collapsedSize: toPercentOfWidth(logicalSizeUnits.collapsedSize),
				minSize: toPercentOfWidth(logicalSizeUnits.minSize),
				defaultSize: toPercentOfWidth(logicalSizeUnits.defaultSize),
				maxSize: toPercentOfWidth(logicalSizeUnits.maxSize)
			};
		}
	);

	return (
		<ResizablePanel
			collapsible={true}
			collapsedSize={collapsedSize}
			minSize={minSize}
			defaultSize={defaultSize}
			maxSize={maxSize}
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
									activeView === item.id && 'bg-gray-100 text-[#005BD3]'
								)}
								onClick={() => editor.activeView.set(item.id as TViewId)}
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
