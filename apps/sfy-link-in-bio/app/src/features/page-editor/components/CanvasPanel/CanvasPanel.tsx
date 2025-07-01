import React from 'react';
import { ResizablePanel } from '@/components';
import { TPageEditor } from '../../lib';
import { NodeCanvas } from '../NodeCanvas';
import { CanvasPanelHeader } from './CanvasPanelHeader';

export const CanvasPanel: React.FC<TCanvasPanelProps> = (props) => {
	const { editor } = props;

	return (
		<ResizablePanel>
			<CanvasPanelHeader editor={editor} />

			<div
				ref={editor.canvasContainerRef}
				className="h-[calc(100%-3rem)] w-full overflow-y-auto bg-neutral-50"
			>
				<NodeCanvas editor={editor} />
			</div>
		</ResizablePanel>
	);
};

interface TCanvasPanelProps {
	editor: TPageEditor;
}
