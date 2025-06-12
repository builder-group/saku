import React from 'react';
import { ResizableHandle, ResizablePanelGroup } from '@/components';
import { useBoundingRectObserver } from '@/hooks';
import { TEditor } from '../lib';
import { CanvasPanel } from './CanvasPanel';
import { ViewContextPanel } from './ViewContextPanel';
import { ViewNavPanel } from './ViewNavPanel';
import { ViewSourcePanel } from './ViewSourcePanel';

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
				<ViewSourcePanel editor={editor} />
				<ResizableHandle className="w-px bg-neutral-200" />
				<CanvasPanel />
				<ResizableHandle className="w-px bg-neutral-200" />
				<ViewContextPanel editor={editor} />
			</ResizablePanelGroup>
		</div>
	);
};

export interface TEditorProps {
	editor: TEditor;
}
