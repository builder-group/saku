import { Icon } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { cn } from '@/lib';
import { TViewType, viewMetadata } from '../../../../environment';
import { TPageEditor } from '../../../../lib';

export const MobileNavPanel: React.FC<TMobileNavPanelProps> & { height: number } = (props) => {
	const { editor } = props;
	const activeView = useFeatureState(editor.activeView);

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
		<nav
			className="flex flex-row justify-between gap-1 bg-white p-2 pr-24"
			style={{ height: MobileNavPanel.height }}
		>
			{viewMetadata.map((item, index) => {
				return (
					<button
						key={index}
						className={cn(
							'cursor-pointer rounded-lg p-3 text-neutral-700 hover:bg-neutral-50',
							activeView === item.type && 'bg-neutral-100 text-[#005BD3]'
						)}
						onClick={() => handleSwitchView(item.type as TViewType)}
					>
						<div className="flex h-5 w-5 items-center justify-center">
							<Icon source={item.icon} />
						</div>
					</button>
				);
			})}
		</nav>
	);
};
MobileNavPanel.height = 60;

interface TMobileNavPanelProps {
	editor: TPageEditor;
}
