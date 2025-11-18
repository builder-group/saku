import { Button, ButtonGroup, Icon } from '@shopify/polaris';
import { useFeatureState, useListener } from 'feature-react';
import React from 'react';
import {
	PolarisDesktopIcon,
	PolarisLiveIcon,
	PolarisMobileIcon,
	PolarisPageDownIcon
} from '@/components';
import { isBreakpointActive } from '@/lib';
import { useEditorBreakpoint } from '../../../../hooks';
import { SaveButton } from '../../../input';
import { PanelHeader as BasePanelHeader } from '../../PanelHeader';
import { TPreviewPanelContext } from './create-preview-panel-context';

export const PanelHeader: React.FC<TPanelHeaderProps> = (props) => {
	const { cx } = props;

	const viewMode = useFeatureState(cx.viewMode);
	const isMd = useEditorBreakpoint(cx.editor, 'md');

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
		window.open(cx.editor.getSiteUrl(), '_blank');
	}, [cx]);

	// =========================================================================
	// Effects
	// =========================================================================

	// Auto-switch to mobile view on mobile breakpoint
	useListener(cx.editor.breakpoint, ({ value }) => {
		if (!isBreakpointActive(value, 'md') && cx.viewMode._v !== 'mobile') {
			cx.switchViewMode('mobile');
		}
	});

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<BasePanelHeader className="justify-between">
			<ButtonGroup variant="segmented">
				<Button
					icon={<Icon source={PolarisDesktopIcon} />}
					pressed={viewMode === 'desktop'}
					onClick={() => cx.switchViewMode('desktop')}
					variant="secondary"
					accessibilityLabel="Desktop view"
					disabled={!isMd}
				/>
				<Button
					icon={<Icon source={PolarisMobileIcon} />}
					pressed={viewMode === 'mobile'}
					onClick={() => cx.switchViewMode('mobile')}
					variant="secondary"
					accessibilityLabel="Mobile view"
				/>
			</ButtonGroup>

			<div className="flex items-center gap-2">
				<Button
					icon={PolarisPageDownIcon}
					variant="secondary"
					onClick={handleJsonExport}
					accessibilityLabel="Export as JSON"
				/>
				<Button
					icon={PolarisLiveIcon}
					variant="secondary"
					onClick={handleViewProductionSite}
					accessibilityLabel="View production site"
				/>
				<SaveButton editor={cx.editor} />
			</div>
		</BasePanelHeader>
	);
};

interface TPanelHeaderProps {
	cx: TPreviewPanelContext;
}
