import React from 'react';
import { ResizablePanel } from '@/components';
import { TPageEditor } from '../lib';
import { CanvasPanelHeader } from './CanvasPanelHeader';
import { NodeCanvas } from './NodeCanvas';

export const CanvasPanel: React.FC<TCanvasPanelProps> = (props) => {
	const { editor } = props;

	const scrollContainerRef = React.useRef<HTMLDivElement>(null);

	return (
		<ResizablePanel>
			<CanvasPanelHeader editor={editor} />

			<div
				ref={scrollContainerRef}
				className="h-[calc(100%-3rem)] w-full overflow-y-auto bg-neutral-50"
			>
				<div className="flex min-h-full w-full flex-col p-4">
					<NodeCanvas editor={editor} scrollContainerRef={scrollContainerRef} />
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TCanvasPanelProps {
	editor: TPageEditor;
}
