import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizablePanel } from '@/components';
import { resolveSite, TPageEditor } from '../../lib';
import { StaticNodeCanvas } from '../NodeCanvas';
import { createStaticCanvasPanelContext } from './create-static-canvas-panel-context';
import { StaticCanvasPanelHeader } from './StaticCanvasPanelHeader';

export const StaticCanvasPanel: React.FC<TStaticCanvasPanelProps> = (props) => {
	const { editor } = props;

	const rootNode = React.useMemo(() => resolveSite(editor.toSite(), editor.shopId).root, [editor]);
	const staticCanvasPanelContext = React.useMemo(
		() => createStaticCanvasPanelContext(editor),
		[editor]
	);
	const viewMode = useFeatureState(staticCanvasPanelContext.viewMode);

	return (
		<ResizablePanel>
			<StaticCanvasPanelHeader staticCanvasPanelContext={staticCanvasPanelContext} />

			<div
				ref={editor.canvasContainerRef}
				className={`h-[calc(100%-3rem)] w-full overflow-y-auto bg-neutral-50 ${
					viewMode === 'mobile' ? 'flex justify-center' : ''
				}`}
			>
				<div className={viewMode === 'mobile' ? 'w-[390px]' : 'w-full'}>
					<StaticNodeCanvas nodes={[rootNode]} />
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TStaticCanvasPanelProps {
	editor: TPageEditor;
}
