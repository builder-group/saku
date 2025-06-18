import { Spinner } from '@shopify/polaris';
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
	const [hasBoundingRect, setHasBoundingRect] = React.useState(false);

	useBoundingRectObserver(
		elementRef,
		editor.boundingRect._v,
		(rect) => {
			editor.boundingRect.set(rect);
			setHasBoundingRect(true);
		},
		[editor]
	);

	return (
		<div ref={elementRef} className="flex min-h-screen w-full flex-col">
			{hasBoundingRect ? (
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
	editor: TEditor;
}
