import { Icon } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
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

	return (
		<ResizablePanel
			collapsible={true}
			collapsedSize={4} // When collapsed, shows at 4% width (icons only)
			minSize={8} // Minimum expanded size is 8% (icons + text)
			defaultSize={4} // Starts collapsed
			maxSize={12} // Maximum size is 12%
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
