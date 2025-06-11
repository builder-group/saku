import React from 'react';
import { ResizableHandle, ResizablePanelGroup } from '@/components';
import { TEditor } from '../lib';
import { CanvasPanel } from './CanvasPanel';
import { ViewControlPanel } from './ViewControlPanel';
import { ViewNavPanel } from './ViewNavPanel';

export const Editor: React.FC<TEditorProps> = (props) => {
	const { editor } = props;

	return (
		<div className="flex min-h-screen w-full flex-col">
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
