import { useCompute } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { TEditor } from '../../lib';
import { ViewSourceContent } from './ViewSourceContent';

export const ViewSourcePanel: React.FC<TViewSourcePanelProps> = (props) => {
	const { editor } = props;

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const { minSize, defaultSize, maxSize } = useCompute(editor.boundingRect, (rect) => {
		const width = rect.right - rect.left;
		const logicalSizeUnits = {
			minSize: 15,
			defaultSize: 15,
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
				<ViewSourceContent editor={editor} />
			</div>
		</ResizablePanel>
	);
};

interface TViewSourcePanelProps {
	editor: TEditor;
}
