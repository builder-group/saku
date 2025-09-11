import { Icon, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { cn } from '@/lib';
import { TViewType, viewMetadata } from '../../../../environment';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';

export const NavPanel: React.FC<TNavPanelProps> = (props) => {
	const { editor, order } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const [collapsed, setCollapsed] = React.useState(true);
	const activeView = useFeatureState(editor.activeView);

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
					collapsedSize: toPercent(60), // ~ 4
					minSize: toPercent(120), // ~ 8
					defaultSize: toPercent(60), // ~ 4
					maxSize: toPercent(180) // ~ 12
				};
			}

			// Mobile (vertical layout): Fixed height for navbar with icons
			const height = rect.bottom - rect.top;
			const toPercent = (pixels: number) => (pixels / (height > 0 ? height : 15)) * 100;
			const navbarHeight = 60; // Fixed height for mobile navbar (~ 4)
			return {
				collapsedSize: toPercent(navbarHeight),
				minSize: toPercent(navbarHeight),
				defaultSize: toPercent(navbarHeight),
				maxSize: toPercent(navbarHeight)
			};
		},
		[isMd],
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
			id="nav-panel"
			order={order}
			collapsible={sizes.collapsedSize != null}
			collapsedSize={sizes.collapsedSize}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
			onCollapse={() => setCollapsed(true)}
			onExpand={() => setCollapsed(false)}
		>
			<div className="flex h-full flex-col bg-white">
				<nav className="flex flex-row justify-between gap-1 p-2 md:flex-col md:justify-start">
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
