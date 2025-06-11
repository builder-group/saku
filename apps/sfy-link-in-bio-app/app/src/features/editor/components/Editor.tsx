import React from 'react';
import { ResizableHandle, ResizablePanelGroup } from '@/components';
import { useBoundingRectObserver } from '@/hooks';
import { TEditor } from '../lib';
import { CanvasPanel } from './CanvasPanel';
import { ViewControlPanel } from './ViewControlPanel';
import { ViewNavPanel } from './ViewNavPanel';

export const Editor: React.FC<TEditorProps> = (props) => {
	const { editor } = props;

	const elementRef = React.useRef<HTMLDivElement>(null);

	useBoundingRectObserver(
		elementRef,
		editor.boundingRect._v,
		(rect) => {
			editor.boundingRect.set(rect);
		},
		[editor]
	);

	return (
		<div ref={elementRef} className="flex min-h-screen w-full flex-col">
			<ResizablePanelGroup direction="horizontal" className="flex-1">
				<ViewNavPanel editor={editor} />
				<ResizableHandle className="w-px bg-neutral-200" />
				<ViewControlPanel editor={editor} />
				<ResizableHandle className="w-px bg-neutral-200" />
				<CanvasPanel />
			</ResizablePanelGroup>
		</div>
	);
};

export interface TEditorProps {
	editor: TEditor;
}
