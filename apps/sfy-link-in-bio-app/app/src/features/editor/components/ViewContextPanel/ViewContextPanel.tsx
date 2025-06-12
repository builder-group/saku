import { useCompute } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { TEditor } from '../../lib';
import { ViewContextContent } from './ViewContextContent';

export const ViewContextPanel: React.FC<TViewContextPanelProps> = (props) => {
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
			minSize: toPercent(225), // ~ 15
			defaultSize: toPercent(300), // ~ 20
			maxSize: toPercent(375) // ~ 25
		};
	});

	if (sizes == null) {
		return null;
	}

	return (
		<ResizablePanel minSize={sizes.minSize} defaultSize={sizes.defaultSize} maxSize={sizes.maxSize}>
			<div className="flex h-full flex-col bg-white">
				<ViewContextContent editor={editor} />
			</div>
		</ResizablePanel>
	);
};

interface TViewContextPanelProps {
	editor: TEditor;
}
