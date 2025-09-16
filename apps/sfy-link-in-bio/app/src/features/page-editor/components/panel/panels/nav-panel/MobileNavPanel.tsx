import { Icon } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { cn } from '@/lib';
import { TViewType, viewMetadata } from '../../../../environment';
import { TPageEditor } from '../../../../lib';

export const MobileNavPanel: React.FC<TMobileNavPanelProps> = (props) => {
	const { editor } = props;
	const activeView = useFeatureState(editor.activeView);

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
		<nav className="flex h-15 flex-row justify-between gap-1 bg-white p-2 pr-24">
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

	// return (
	// 	<div className="flex h-15 w-full items-center justify-between bg-white px-4 py-2">
	// 		<nav className="flex w-full flex-row items-center justify-between gap-2">
	// 			{viewMetadata.map((item, index) => {
	// 				return (
	// 					<button
	// 						key={index}
	// 						className={cn(
	// 							'flex flex-1 cursor-pointer items-center justify-center rounded-lg p-3 text-neutral-700 hover:bg-neutral-50',
	// 							activeView === item.type && 'bg-neutral-100 text-[#005BD3]'
	// 						)}
	// 						onClick={() => handleSwitchView(item.type as TViewType)}
	// 					>
	// 						<div className="flex h-6 w-6 items-center justify-center">
	// 							<Icon source={item.icon} />
	// 						</div>
	// 					</button>
	// 				);
	// 			})}
	// 		</nav>
	// 	</div>
	// );
};

interface TMobileNavPanelProps {
	editor: TPageEditor;
}
