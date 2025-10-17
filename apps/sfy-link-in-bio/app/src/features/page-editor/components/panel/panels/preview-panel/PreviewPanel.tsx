import { Spinner } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { IframePortal, ResizablePanel } from '@/components';
import { cn } from '@/lib';
import tailwindStylesHref from '@/styles.css?url';
import { getFontUrls, TPageEditor } from '../../../../lib';
import { StaticNodeCanvas } from '../../../node';
import { createPreviewPanelContext } from './create-preview-panel-context';
import { PanelHeader } from './PanelHeader';

export const PreviewPanel: React.FC<TPreviewPanelProps> = (props) => {
	const { editor, order } = props;

	const cx = React.useMemo(() => createPreviewPanelContext(editor), [editor]);
	const previewedNode = useFeatureState(cx.previewedNode);
	const viewMode = useFeatureState(cx.viewMode);

	const [stylesLoaded, setStylesLoaded] = React.useState(false);

	const links = React.useMemo(() => {
		const fontUrls = getFontUrls(editor.assetsMap);
		return [
			{ rel: 'stylesheet', href: tailwindStylesHref },
			...fontUrls.map((url) => ({ rel: 'stylesheet', href: url }))
		];
	}, [editor.assetsMap]);

	return (
		<ResizablePanel id="preview-panel" order={order} className="relative">
			<PanelHeader cx={cx} />

			{!stylesLoaded && (
				<div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-neutral-50">
					<Spinner accessibilityLabel="Loading preview canvas..." size="small" />
				</div>
			)}

			<div className="absolute bottom-2 left-2 z-20">
				<s-badge tone="info" icon="info">
					Production Preview
				</s-badge>
			</div>

			<div
				ref={editor.canvasContainerRef}
				className={cn(
					'w-full overflow-y-auto',
					// 100% - 3rem (panel header height)
					'h-[calc(100%-3rem)]',
					viewMode === 'mobile' && 'flex justify-center'
				)}
				style={{
					backgroundImage:
						'repeating-linear-gradient(-45deg, var(--color-neutral-50), var(--color-neutral-50) 13px, var(--color-neutral-200) 13px, var(--color-neutral-200) 14px)',
					backgroundSize: '40px 40px'
				}}
			>
				{/* Use iframe to fully isolate the canvas from global styles (e.g. Polaris) and get correct viewport-based media queries */}
				<IframePortal
					links={links}
					onStylesLoaded={() => setStylesLoaded(true)}
					className={cn('h-full', viewMode === 'mobile' ? 'w-[390px]' : 'w-full')}
					style={{ border: viewMode === 'mobile' ? '1px solid black' : 'none' }}
				>
					<StaticNodeCanvas
						cx={editor.pageContext}
						nodes={previewedNode != null ? [previewedNode] : []}
					/>
				</IframePortal>
			</div>
		</ResizablePanel>
	);
};

interface TPreviewPanelProps {
	editor: TPageEditor;
	order: number;
}
