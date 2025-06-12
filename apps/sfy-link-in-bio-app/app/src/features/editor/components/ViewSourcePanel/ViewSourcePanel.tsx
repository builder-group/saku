import { useCompute } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { TEditor } from '../../lib';
import { ViewSourceContent } from './ViewSourceContent';

export const ViewSourcePanel: React.FC<TViewSourcePanelProps> = (props) => {
	const { editor } = props;

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(editor.boundingRect, (rect) => {
		const width = rect.right - rect.left;
		if (width <= 0) {
			return null;
		}

		const toPercent = (pixels: number) => (pixels / width) * 100;

		return {
			minSize: toPercent(150), // ~ 10
			defaultSize: toPercent(225), // ~ 15
			maxSize: toPercent(300) // ~ 20
		};
	});

	if (sizes == null) {
		return null;
	}

	return (
		<ResizablePanel minSize={sizes.minSize} defaultSize={sizes.defaultSize} maxSize={sizes.maxSize}>
			<div className="flex h-full flex-col bg-white">
				<ViewSourceContent editor={editor} />
			</div>
		</ResizablePanel>
	);
};

interface TViewSourcePanelProps {
	editor: TEditor;
}
