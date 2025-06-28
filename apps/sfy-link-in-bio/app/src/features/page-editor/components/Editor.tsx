import { Spinner } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { ResizableHandle, ResizablePanelGroup } from '@/components';
import { useBoundingRectObserver } from '@/hooks';
import { TPageEditor } from '../lib';
import { CanvasPanel } from './CanvasPanel';
import { ViewContextPanel } from './ViewContextPanel';
import { ViewNavPanel } from './ViewNavPanel';
import { ViewSourcePanel } from './ViewSourcePanel';

export const Editor: React.FC<TEditorProps> = (props) => {
	const { editor } = props;

	const isReady = useCompute(editor.isReady, (ready) => ready);

	useBoundingRectObserver(
		editor.editorRef,
		editor.boundingRect._v,
		(rect) => {
			editor.boundingRect.set(rect);
			editor.isReady.set(true);
		},
		[editor]
	);

	return (
		<div ref={editor.editorRef} className="flex h-screen w-full flex-col">
			{isReady ? (
				<ResizablePanelGroup direction="horizontal" className="flex-1">
					<ViewNavPanel editor={editor} />
					<ResizableHandle className="w-px bg-neutral-200" />
					<ViewSourcePanel editor={editor} />
					<ResizableHandle className="w-px bg-neutral-200" />
					<CanvasPanel editor={editor} />
					<ResizableHandle className="w-px bg-neutral-200" />
					<ViewContextPanel editor={editor} />
				</ResizablePanelGroup>
			) : (
				<div className="flex h-full w-full items-center justify-center bg-white">
					<Spinner accessibilityLabel="Loading editor..." size="small" />
				</div>
			)}
		</div>
	);
};

export interface TEditorProps {
	editor: TPageEditor;
}
