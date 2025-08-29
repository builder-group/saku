import { Spinner } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizablePanel, ShadowRoot } from '@/components';
import { cn } from '@/lib';
import tailwindStylesHref from '@/styles.css?url';
import { TPageEditor } from '../../../../lib';
import { StaticNodeCanvas } from '../../../NodeCanvas';
import { createPreviewPanelContext } from './create-preview-panel-context';
import { PanelHeader } from './PanelHeader';

export const PreviewPanel: React.FC<TPreviewPanelProps> = (props) => {
	const { editor, order } = props;

	const cx = React.useMemo(() => createPreviewPanelContext(editor), [editor]);
	const previewedNode = useFeatureState(cx.previewedNode);
	const viewMode = useFeatureState(cx.viewMode);

	const [stylesLoaded, setStylesLoaded] = React.useState(false);

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

			{/* Use ShadowRoot to fully isolate the static canvas from global styles (e.g., Polaris), ensuring only Tailwind styles apply inside. */}
			<ShadowRoot
				links={[{ rel: 'stylesheet', href: tailwindStylesHref }]}
				onStylesLoaded={() => setStylesLoaded(true)}
				className="h-full w-full"
			>
				<div
					ref={editor.canvasContainerRef}
					className={cn(
						'h-[calc(100%-3rem)] w-full overflow-y-auto',
						viewMode === 'mobile' && 'flex justify-center'
					)}
					style={{
						backgroundImage:
							'repeating-linear-gradient(-45deg, var(--color-neutral-50), var(--color-neutral-50) 13px, var(--color-neutral-200) 13px, var(--color-neutral-200) 14px)',
						backgroundSize: '40px 40px'
					}}
				>
					<div className={cn('h-full', viewMode === 'mobile' ? 'w-[390px]' : 'w-full')}>
						<div className={cn(viewMode === 'mobile' && 'border-r border-l border-black')}>
							<StaticNodeCanvas
								cx={editor.pageContext}
								nodes={previewedNode != null ? [previewedNode] : []}
							/>
						</div>
					</div>
				</div>
			</ShadowRoot>
		</ResizablePanel>
	);
};

interface TPreviewPanelProps {
	editor: TPageEditor;
	order: number;
}
