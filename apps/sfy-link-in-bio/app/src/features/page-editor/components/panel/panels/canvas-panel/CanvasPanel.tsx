import { Spinner } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { IframePortal, ResizablePanel } from '@/components';
import { cn } from '@/lib';
import tailwindStylesHref from '@/styles.css?url';
import { useEditorBreakpoint } from '../../../../hooks';
import { getFontUrls, TPageEditor } from '../../../../lib';
import { NodeCanvas } from '../../../node';
import { PanelHeader } from './PanelHeader';

export const CanvasPanel: React.FC<TCanvasPanelProps> = (props) => {
	const { editor } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const [stylesLoaded, setStylesLoaded] = React.useState(false);

	const links = useCompute(
		editor.assetsMap,
		({ value: assetsMap }) => {
			const fontUrls = getFontUrls(assetsMap);
			return [
				{ rel: 'stylesheet', href: tailwindStylesHref },
				...fontUrls.map((url) => ({ rel: 'stylesheet', href: url }))
			];
		},
		[],
		{
			isEqual(a, b) {
				return a.length === b.length && a.every((link, i) => link.href === b[i]?.href);
			}
		}
	);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			// Desktop (horizontal layout): Resizable based on width
			if (isMd) {
				const width = rect.right - rect.left;
				const toPercent = (pixels: number) => `${(pixels / width) * 100}%`;
				return {
					minSize: toPercent(405)
				};
			}

			// Mobile (vertical layout): Resizable based on height
			return {
				minSize: undefined
			};
		},
		[isMd],
		{
			isEqual(a, b) {
				return a.minSize === b.minSize;
			}
		}
	);

	return (
		<ResizablePanel id="canvas-panel" minSize={sizes.minSize} className="relative">
			<PanelHeader editor={editor} />

			{!stylesLoaded && (
				<div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-neutral-50">
					<Spinner accessibilityLabel="Loading editor canvas..." size="small" />
				</div>
			)}

			{/* Use iframe to fully isolate the canvas from global styles (e.g. Polaris) and get correct viewport-based media queries */}
			<IframePortal
				ref={editor.canvasContainerRef}
				links={links}
				onStylesLoaded={() => setStylesLoaded(true)}
				className={cn(
					'w-full',
					// 100% - 3rem (panel header height)
					'h-[calc(100%-3rem)]'
				)}
			>
				<NodeCanvas editor={editor} />
			</IframePortal>
		</ResizablePanel>
	);
};

interface TCanvasPanelProps {
	editor: TPageEditor;
}
