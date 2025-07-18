import { Spinner } from '@shopify/polaris';
import React from 'react';
import { ResizablePanel, ShadowRoot } from '@/components';
import tailwindStylesHref from '@/styles.css?url';
import { TPageEditor } from '../../lib';
import { NodeCanvas } from '../NodeCanvas';
import { CanvasPanelHeader } from './CanvasPanelHeader';

export const CanvasPanel: React.FC<TCanvasPanelProps> = (props) => {
	const { editor } = props;
	const [stylesLoaded, setStylesLoaded] = React.useState(false);

	return (
		<ResizablePanel className="relative">
			<CanvasPanelHeader editor={editor} />

			{!stylesLoaded && (
				<div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-neutral-50">
					<Spinner accessibilityLabel="Loading editor canvas..." size="small" />
				</div>
			)}

			<div
				ref={editor.canvasContainerRef}
				className="h-[calc(100%-3rem)] w-full overflow-y-auto bg-neutral-50"
			>
				{/* Use ShadowRoot to fully isolate the static canvas from global styles (e.g., Polaris), ensuring only Tailwind styles apply inside. */}
				<ShadowRoot
					links={[{ rel: 'stylesheet', href: tailwindStylesHref }]}
					onStylesLoaded={() => setStylesLoaded(true)}
				>
					<NodeCanvas editor={editor} />
				</ShadowRoot>
			</div>
		</ResizablePanel>
	);
};

interface TCanvasPanelProps {
	editor: TPageEditor;
}
