import { Icon, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { cn } from '@/lib';
import { TViewType, viewMetadata } from '../../../../environment';
import { TPageEditor } from '../../../../lib';

export const NavPanel: React.FC<TNavPanelProps> = (props) => {
	const { editor, order } = props;

	const [collapsed, setCollapsed] = React.useState(true);
	const activeView = useFeatureState(editor.activeView);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			const width = rect.right - rect.left;
			const toPercent = (pixels: number) => (pixels / (width > 0 ? width : 15)) * 100;
			return {
				collapsedSize: toPercent(60), // ~ 4
				minSize: toPercent(120), // ~ 8
				defaultSize: toPercent(60), // ~ 4
				maxSize: toPercent(180) // ~ 12
			};
		},
		[],
		{
			isEqual(a, b) {
				return (
					a.collapsedSize === b.collapsedSize &&
					a.minSize === b.minSize &&
					a.defaultSize === b.defaultSize &&
					a.maxSize === b.maxSize
				);
			}
		}
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleSwitchView = React.useCallback(
		(viewType: TViewType) => {
			editor.switchView({ type: viewType });
		},
		[editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			id="nav-panel"
			order={order}
			collapsible={true}
			collapsedSize={sizes.collapsedSize}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
			onCollapse={() => setCollapsed(true)}
			onExpand={() => setCollapsed(false)}
		>
			<div className="flex h-full flex-col bg-white">
				<nav className="flex flex-col gap-1 p-2">
					{viewMetadata.map((item, index) => {
						return (
							<button
								key={index}
								className={cn(
									'flex cursor-pointer items-center gap-3 rounded-lg p-3 text-left text-neutral-700 hover:bg-neutral-50',
									activeView === item.type && 'bg-neutral-100 text-[#005BD3]'
								)}
								onClick={() => handleSwitchView(item.type as TViewType)}
							>
								<div className="flex h-5 w-5 items-center justify-center">
									<Icon source={item.icon} />
								</div>
								{!collapsed && (
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

interface TNavPanelProps {
	editor: TPageEditor;
	order: number;
}
