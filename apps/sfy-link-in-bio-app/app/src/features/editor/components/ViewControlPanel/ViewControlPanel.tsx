import { Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { views } from '../../environment';
import { TEditor } from '../../lib';
import { PanelHeader } from '../PanelHeader';
import { ViewControlContent } from './ViewControlContent';

export const ViewControlPanel: React.FC<TViewControlPanelProps> = (props) => {
	const { editor } = props;
	const activeView = useFeatureState(editor.activeView);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const { minSize, defaultSize, maxSize } = useCompute(editor.boundingRect, (rect) => {
		const width = rect.right - rect.left;
		const logicalSizeUnits = {
			minSize: 15,
			defaultSize: 20,
			maxSize: 25
		};

		if (width <= 0) {
			return logicalSizeUnits;
		}

		const unitPixelValue = 15; // 1 unit = 15px
		const toPercentOfWidth = (unit: number) => ((unit * unitPixelValue) / width) * 100;

		return {
			minSize: toPercentOfWidth(logicalSizeUnits.minSize),
			defaultSize: toPercentOfWidth(logicalSizeUnits.defaultSize),
			maxSize: toPercentOfWidth(logicalSizeUnits.maxSize)
		};
	});

	return (
		<ResizablePanel minSize={minSize} defaultSize={defaultSize} maxSize={maxSize}>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						{views[activeView].label}
					</Text>
				</PanelHeader>

				<ViewControlContent editor={editor} />
			</div>
		</ResizablePanel>
	);
};

interface TViewControlPanelProps {
	editor: TEditor;
}
