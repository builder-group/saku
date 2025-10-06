import { Icon, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { PolarisPlusCircleIcon } from '@/components';
import { cn } from '@/lib';
import { TPageEditor } from '../../../../lib';
import { LayerSelectorPopover } from './LayerSelectorPopover';

export const AddLayerButton: React.FC<TAddLayerButtonProps> = (props) => {
	const { editor } = props;
	const isDragging = useFeatureState(editor.isDraggingLayer);

	return (
		<LayerSelectorPopover
			editor={editor}
			activator={
				<div
					className={cn(
						'mt-2 flex h-[34px] items-center gap-2 rounded-lg px-2 text-[#005BD3]',
						isDragging && 'opacity-50',
						!isDragging && 'cursor-pointer hover:bg-neutral-50'
					)}
				>
					<div>
						<Icon source={PolarisPlusCircleIcon} />
					</div>
					<Text as="p" variant="bodyMd">
						Add layer
					</Text>
				</div>
			}
			width="activator"
		/>
	);
};

interface TAddLayerButtonProps {
	editor: TPageEditor;
}
