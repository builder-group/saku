import { Button, InlineError, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import {
	isValidGa4MeasurementId,
	isValidMetaPixelId,
	normalizeGa4MeasurementId,
	normalizeMetaPixelId,
	TPageEditor
} from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { integrationTypeMetadata } from './integration-metadata';

export const IntegrationDetailsPanel: React.FC<TIntegrationDetailsPanelProps> = (props) => {
	const { editor } = props;
	const selectedIntegrationId = useFeatureState(editor.selectedIntegrationId);
	const integrations = useFeatureState(editor.integrationsMap);
	const selectedIntegration =
		selectedIntegrationId != null ? integrations[selectedIntegrationId] : null;

	const ga4Error = React.useMemo(() => {
		if (selectedIntegration?.type !== 'ga4') {
			return null;
		}
		const measurementId = normalizeGa4MeasurementId(selectedIntegration.measurementId);
		if (measurementId == null) {
			return null;
		}
		return isValidGa4MeasurementId(measurementId)
			? null
			: 'Enter a valid GA4 Measurement ID, for example G-ABCDEFG123.';
	}, [selectedIntegration]);

	const metaPixelError = React.useMemo(() => {
		if (selectedIntegration?.type !== 'meta-pixel') {
			return null;
		}
		const pixelId = normalizeMetaPixelId(selectedIntegration.pixelId);
		if (pixelId == null) {
			return null;
		}
		return isValidMetaPixelId(pixelId) ? null : 'Enter a valid Meta Pixel ID using digits only.';
	}, [selectedIntegration]);

	// =========================================================================
	// Actions
	// =========================================================================

	const handleRemove = React.useCallback(() => {
		if (selectedIntegrationId == null) {
			return;
		}
		editor.removeIntegration(selectedIntegrationId);
	}, [editor, selectedIntegrationId]);

	const handleGa4Change = React.useCallback(
		(value: string) => {
			if (selectedIntegrationId == null) {
				return;
			}

			editor.updateIntegration(selectedIntegrationId, (integration) => {
				if (integration.type !== 'ga4') {
					return integration;
				}

				integration.measurementId = value.trim().toUpperCase() || undefined;
				return integration;
			});
		},
		[editor, selectedIntegrationId]
	);

	const handleMetaPixelChange = React.useCallback(
		(value: string) => {
			if (selectedIntegrationId == null) {
				return;
			}

			editor.updateIntegration(selectedIntegrationId, (integration) => {
				if (integration.type !== 'meta-pixel') {
					return integration;
				}

				integration.pixelId = value.trim() || undefined;
				return integration;
			});
		},
		[editor, selectedIntegrationId]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel id="integration-details-panel" className="bg-white">
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						{selectedIntegration != null
							? integrationTypeMetadata[selectedIntegration.type].label
							: 'Integration Details'}
					</Text>
				</PanelHeader>

				<div className="flex-1 overflow-auto p-4">
					{selectedIntegration == null && (
						<div className="space-y-2">
							<Text as="p" variant="bodyMd" tone="subdued">
								Select or add an integration to edit its settings.
							</Text>
						</div>
					)}

					{selectedIntegration?.type === 'shopify' && (
						<div className="space-y-2">
							<Text as="h3" variant="headingMd">
								Shopify is connected
							</Text>
							<Text as="p" variant="bodyMd" tone="subdued">
								This integration is managed automatically for product, cart, and checkout features
								on your page.
							</Text>
						</div>
					)}

					{selectedIntegration?.type === 'ga4' && (
						<div className="space-y-4">
							<div className="space-y-1">
								<Text as="h3" variant="headingMd">
									Google Analytics
								</Text>
								<Text as="p" variant="bodyMd" tone="subdued">
									Add your GA4 Measurement ID to track pageviews and click events after you publish.
								</Text>
							</div>

							<div className="space-y-1">
								<Text as="span" variant="bodySm" tone="subdued">
									Measurement ID
								</Text>
								<TextField
									label="Measurement ID"
									labelHidden
									autoComplete="off"
									placeholder="G-ABCDEFG123"
									value={selectedIntegration.measurementId ?? ''}
									onChange={handleGa4Change}
								/>
								{ga4Error != null && (
									<InlineError message={ga4Error} fieldID="ga4-measurement-id" />
								)}
							</div>

							<Button tone="critical" variant="plain" onClick={handleRemove}>
								Remove integration
							</Button>
						</div>
					)}

					{selectedIntegration?.type === 'meta-pixel' && (
						<div className="space-y-4">
							<div className="space-y-1">
								<Text as="h3" variant="headingMd">
									Meta Pixel
								</Text>
								<Text as="p" variant="bodyMd" tone="subdued">
									Add your Meta Pixel ID to track pageviews and click events after you publish.
								</Text>
							</div>

							<div className="space-y-1">
								<Text as="span" variant="bodySm" tone="subdued">
									Pixel ID
								</Text>
								<TextField
									label="Pixel ID"
									labelHidden
									autoComplete="off"
									placeholder="123456789012345"
									value={selectedIntegration.pixelId ?? ''}
									onChange={handleMetaPixelChange}
								/>
								{metaPixelError != null && (
									<InlineError message={metaPixelError} fieldID="meta-pixel-id" />
								)}
							</div>

							<Button tone="critical" variant="plain" onClick={handleRemove}>
								Remove integration
							</Button>
						</div>
					)}
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TIntegrationDetailsPanelProps {
	editor: TPageEditor;
}
