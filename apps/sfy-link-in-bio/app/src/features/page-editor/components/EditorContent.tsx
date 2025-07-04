import { Spinner } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizableHandle, ResizablePanelGroup } from '@/components';
import { TPageEditor } from '../lib';
import { CanvasPanel } from './CanvasPanel';
import { ViewContextPanel } from './ViewContextPanel';
import { ViewNavPanel } from './ViewNavPanel';
import { ViewSourcePanel } from './ViewSourcePanel';

export const EditorContent: React.FC<TEditorContentProps> = (props) => {
	const { editor } = props;

	const isReady = useFeatureState(editor.isReady);
	const activeView = useFeatureState(editor.activeView);

	// Show loading spinner if not ready
	if (!isReady) {
		return (
			<div className="flex h-full w-full items-center justify-center bg-white">
				<Spinner accessibilityLabel="Loading editor..." size="small" />
			</div>
		);
	}

	switch (activeView) {
		case 'layers':
		case 'settings':
			return (
				<ResizablePanelGroup direction="horizontal" className="flex-1">
					<ViewNavPanel editor={editor} />
					<ResizableHandle className="w-px bg-neutral-200" />
					<ViewSourcePanel editor={editor} />
					<ResizableHandle className="w-px bg-neutral-200" />
					<CanvasPanel editor={editor} />
					<ResizableHandle className="w-px bg-neutral-200" />
					<ViewContextPanel editor={editor} />
				</ResizablePanelGroup>
			);
		case 'preview':
			return (
				<ResizablePanelGroup direction="horizontal" className="flex-1">
					<ViewNavPanel editor={editor} />
					<ResizableHandle className="w-px bg-neutral-200" />
					<CanvasPanel editor={editor} />
				</ResizablePanelGroup>
			);
		default:
			return null;
	}
};

export interface TEditorContentProps {
	editor: TPageEditor;
}
