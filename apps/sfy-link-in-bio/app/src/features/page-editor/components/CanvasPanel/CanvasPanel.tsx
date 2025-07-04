import { useCompute } from 'feature-react';
import React from 'react';
import { ResizablePanel } from '@/components';
import { resolveSite, TPageEditor } from '../../lib';
import { NodeCanvas, StaticNodeCanvas } from '../NodeCanvas';
import { CanvasPanelHeader } from './CanvasPanelHeader';

export const CanvasPanel: React.FC<TCanvasPanelProps> = (props) => {
	const { editor } = props;
	const showStaticNodeCanvas = useCompute(
		editor.activeView,
		(activeView) => activeView === 'preview'
	);

	return (
		<ResizablePanel>
			<CanvasPanelHeader editor={editor} />

			<div
				ref={editor.canvasContainerRef}
				className="h-[calc(100%-3rem)] w-full overflow-y-auto bg-neutral-50"
			>
				{showStaticNodeCanvas ? (
					<StaticNodeCanvas nodes={[resolveSite(editor.toSite()).root]} />
				) : (
					<NodeCanvas editor={editor} />
				)}
			</div>
		</ResizablePanel>
	);
};

interface TCanvasPanelProps {
	editor: TPageEditor;
}
