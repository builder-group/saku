import { Button, ButtonGroup, Icon } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { DesktopIcon, LiveIcon, MobileIcon, PageDownIcon } from '@/components';
import { PublishButton } from '../../../input';
import { PanelHeader as BasePanelHeader } from '../../PanelHeader';
import { TPreviewPanelContext } from './create-preview-panel-context';

export const PanelHeader: React.FC<TPanelHeaderProps> = (props) => {
	const { cx } = props;

	const viewMode = useFeatureState(cx.viewMode);

	// =========================================================================
	// Events
	// =========================================================================

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
		<BasePanelHeader className="justify-between">
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
				<PublishButton editor={cx.editor} />
			</div>
		</BasePanelHeader>
	);
};

interface TPanelHeaderProps {
	cx: TPreviewPanelContext;
}
