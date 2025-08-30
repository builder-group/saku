import { Button, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { PlusIcon } from '@/components';
import { TPageEditor } from '../../../../lib';
import { PanelHeader as PanelHeaderBase } from '../../PanelHeader';
import { LayerSelectorPopover } from './LayerSelectorPopover';

export const PanelHeader: React.FC<TPanelHeaderProps> = (props) => {
	const { editor } = props;
	const isDragging = useFeatureState(editor.isDraggingLayer);

	return (
		<PanelHeaderBase className="flex flex-row items-center justify-between">
			<Text as="h2" variant="headingMd">
				Layers
			</Text>
			<LayerSelectorPopover
				editor={editor}
				activator={
					<div className="flex items-center justify-center">
						<Button icon={PlusIcon} disabled={isDragging} variant="plain" />
					</div>
				}
				width="auto"
			/>
		</PanelHeaderBase>
	);
};

interface TPanelHeaderProps {
	editor: TPageEditor;
}
