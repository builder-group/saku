import { Button, ButtonGroup, Icon } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { DesktopIcon, LiveIcon, MobileIcon, PageDownIcon } from '@/components';
import { useConfetti } from '@/hooks';
import { PanelHeader } from '../PanelHeader';
import { TStaticCanvasPanelContext } from './create-static-canvas-panel-context';

export const StaticCanvasPanelHeader: React.FC<TStaticCanvasPanelHeaderProps> = (props) => {
	const { staticCanvasPanelContext: cx } = props;

	const viewMode = useFeatureState(cx.viewMode);

	const [isPublishing, setIsPublishing] = React.useState(false);
	const triggerConfetti = useConfetti();

	// =========================================================================
	// Events
	// =========================================================================

	const handlePublish = React.useCallback(async () => {
		setIsPublishing(true);
		const isPublished = await cx.editor.publish();
		if (isPublished) {
			triggerConfetti();
		}
		setIsPublishing(false);
	}, [cx, triggerConfetti]);

	const handleJsonExport = React.useCallback(() => {
		const json = JSON.stringify(cx.editor.toSite(), null, 2);

		// Copy to clipboard
		navigator.clipboard
			.writeText(json)
			.then(() => {
				cx.editor.shopify.toast.show('JSON copied to clipboard');
			})
			// Fallback: Download as file
			.catch(() => {
				const blob = new Blob([json], { type: 'application/json' });
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `site-${cx.editor.site.id}.json`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
				cx.editor.shopify.toast.show('JSON downloaded');
			});
	}, [cx]);

	const handleViewProductionSite = React.useCallback(() => {
		window.open(cx.editor.site.url, '_blank');
	}, [cx]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<PanelHeader className="h-12 justify-between">
			<ButtonGroup variant="segmented">
				<Button
					icon={<Icon source={DesktopIcon} />}
					pressed={viewMode === 'desktop'}
					onClick={() => cx.switchViewMode('desktop')}
					variant="secondary"
					accessibilityLabel="Desktop view"
				/>
				<Button
					icon={<Icon source={MobileIcon} />}
					pressed={viewMode === 'mobile'}
					onClick={() => cx.switchViewMode('mobile')}
					variant="secondary"
					accessibilityLabel="Mobile view"
				/>
			</ButtonGroup>

			<div className="flex items-center gap-2">
				<Button
					icon={PageDownIcon}
					variant="secondary"
					onClick={handleJsonExport}
					accessibilityLabel="Export as JSON"
				/>
				<Button
					icon={LiveIcon}
					variant="secondary"
					onClick={handleViewProductionSite}
					accessibilityLabel="View production site"
				/>
				<Button
					variant="primary"
					onClick={handlePublish}
					disabled={isPublishing}
					loading={isPublishing}
				>
					Publish
				</Button>
			</div>
		</PanelHeader>
	);
};

interface TStaticCanvasPanelHeaderProps {
	staticCanvasPanelContext: TStaticCanvasPanelContext;
}
