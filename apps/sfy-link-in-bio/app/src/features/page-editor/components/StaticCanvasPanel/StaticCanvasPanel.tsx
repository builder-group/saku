import { Spinner } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizablePanel, ShadowRoot } from '@/components';
import tailwindStylesHref from '@/styles.css?url';
import { EditorSiteResolveContext, resolvePageNode, TPageEditor } from '../../lib';
import { StaticNodeCanvas } from '../NodeCanvas';
import { createStaticCanvasPanelContext } from './create-static-canvas-panel-context';
import { StaticCanvasPanelHeader } from './StaticCanvasPanelHeader';

export const StaticCanvasPanel: React.FC<TStaticCanvasPanelProps> = (props) => {
	const { editor } = props;

	const rootNode = React.useMemo(
		() =>
			resolvePageNode(editor.getRootNode()._v, {
				site: new EditorSiteResolveContext(editor)
			}),
		[editor]
	);
	const staticCanvasPanelContext = React.useMemo(
		() => createStaticCanvasPanelContext(editor),
		[editor]
	);
	const viewMode = useFeatureState(staticCanvasPanelContext.viewMode);

	const [stylesLoaded, setStylesLoaded] = React.useState(false);

	return (
		<ResizablePanel className="relative">
			<StaticCanvasPanelHeader staticCanvasPanelContext={staticCanvasPanelContext} />

			{!stylesLoaded && (
				<div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-neutral-50">
					<Spinner accessibilityLabel="Loading preview canvas..." size="small" />
				</div>
			)}

			<div
				ref={editor.canvasContainerRef}
				className={`h-[calc(100%-3rem)] w-full overflow-y-auto bg-neutral-50 ${
					viewMode === 'mobile' ? 'flex justify-center' : ''
				}`}
			>
				{/* Use ShadowRoot to fully isolate the static canvas from global styles (e.g., Polaris), ensuring only Tailwind styles apply inside. */}
				<ShadowRoot
					links={[{ rel: 'stylesheet', href: tailwindStylesHref }]}
					onStylesLoaded={() => setStylesLoaded(true)}
				>
					<div className={viewMode === 'mobile' ? 'w-[390px]' : 'w-full'}>
						<StaticNodeCanvas cx={editor.pageContext} nodes={[rootNode]} />
					</div>
				</ShadowRoot>
			</div>
		</ResizablePanel>
	);
};

interface TStaticCanvasPanelProps {
	editor: TPageEditor;
}
