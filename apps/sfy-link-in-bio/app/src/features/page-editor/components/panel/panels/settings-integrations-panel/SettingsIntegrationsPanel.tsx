import { TIntegration } from '@repo/editor';
import { Button, Popover, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { PolarisPlusIcon, ResizablePanel } from '@/components';
import { createDisplayNameFromShop } from '@/lib';
import { useEditorBreakpoint } from '../../../../hooks';
import {
	isValidGa4MeasurementId,
	isValidMetaPixelId,
	normalizeGa4MeasurementId,
	normalizeMetaPixelId,
	TPageEditor
} from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import {
	addableIntegrationTypes,
	integrationTypeMetadata,
	integrationTypeOrder
} from '../integration-details-panel/integration-metadata';

export const SettingsIntegrationsPanel: React.FC<TSettingsIntegrationsPanelProps> = (props) => {
	const { editor } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const selectedIntegrationId = useFeatureState(editor.selectedIntegrationId);
	const integrations = useFeatureState(editor.integrationsMap);
	const [isAddPopoverActive, setIsAddPopoverActive] = React.useState(false);
	const { connectedIntegrations, addableIntegrations } = React.useMemo(() => {
		const connectedIntegrations = Object.values(integrations)
			.map((integration) => {
				switch (integration.type) {
					case 'shopify':
						return {
							id: integration.id,
							type: integration.type,
							title: createDisplayNameFromShop(integration.shopId),
							subtitle: integration.shopId,
							statusLabel: 'Connected',
							statusTone: 'success' as const
						};
					case 'ga4':
						const measurementId = normalizeGa4MeasurementId(integration.measurementId);
						const isGa4Configured = isValidGa4MeasurementId(measurementId);
						return {
							id: integration.id,
							type: integration.type,
							title: integrationTypeMetadata.ga4.label,
							subtitle: measurementId ?? 'Add your GA4 Measurement ID',
							statusLabel: isGa4Configured
								? 'Configured'
								: measurementId != null
									? 'Invalid ID'
									: 'Needs setup',
							statusTone: isGa4Configured
								? ('success' as const)
								: measurementId != null
									? ('critical' as const)
									: ('warning' as const)
						};
					case 'meta-pixel':
						const pixelId = normalizeMetaPixelId(integration.pixelId);
						const isMetaPixelConfigured = isValidMetaPixelId(pixelId);
						return {
							id: integration.id,
							type: integration.type,
							title: integrationTypeMetadata['meta-pixel'].label,
							subtitle: pixelId ?? 'Add your Meta Pixel ID',
							statusLabel: isMetaPixelConfigured
								? 'Configured'
								: pixelId != null
									? 'Invalid ID'
									: 'Needs setup',
							statusTone: isMetaPixelConfigured
								? ('success' as const)
								: pixelId != null
									? ('critical' as const)
									: ('warning' as const)
						};
					default:
						return null;
				}
			})
			.filter((integration): integration is NonNullable<typeof integration> => integration != null)
			.sort((a, b) => integrationTypeOrder[a.type] - integrationTypeOrder[b.type]);

		return {
			connectedIntegrations,
			addableIntegrations: addableIntegrationTypes.filter(
				(type) => !Object.values(integrations).some((integration) => integration.type === type)
			)
		};
	}, [integrations]);

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
					minSize: toPercent(300),
					defaultSize: toPercent(405),
					maxSize: toPercent(525)
				};
			}

			// Mobile (vertical layout): Resizable based on height
			return {
				minSize: undefined,
				defaultSize: undefined,
				maxSize: undefined
			};
		},
		[isMd],
		{
			isEqual(a, b) {
				return (
					a.minSize === b.minSize && a.defaultSize === b.defaultSize && a.maxSize === b.maxSize
				);
			}
		}
	);

	// =========================================================================
	// Actions
	// =========================================================================

	const handleIntegrationSelect = React.useCallback(
		(integrationId: string) => {
			editor.selectIntegration(integrationId as TIntegration['id']);
		},
		[editor]
	);

	const handleAddIntegration = React.useCallback(
		(type: (typeof addableIntegrationTypes)[number]) => {
			editor.addIntegration(type);
			setIsAddPopoverActive(false);
		},
		[editor]
	);

	const toggleAddPopover = React.useCallback(() => {
		setIsAddPopoverActive((active) => !active);
	}, []);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			id="settings-integrations-panel"
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
		>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<div className="flex w-full items-center justify-between gap-3">
						<Text as="h2" variant="headingMd">
							Integrations
						</Text>
						<Popover
							active={isAddPopoverActive}
							activator={
								<div className="flex items-center">
									<Button
										icon={PolarisPlusIcon}
										variant="plain"
										size="micro"
										disabled={addableIntegrations.length === 0}
										accessibilityLabel="Add integration"
										onClick={toggleAddPopover}
									/>
								</div>
							}
							autofocusTarget="first-node"
							onClose={toggleAddPopover}
						>
							<div className="flex min-w-56 flex-col gap-2 p-2">
								{addableIntegrations.length === 0 ? (
									<Text as="p" variant="bodyMd" tone="subdued">
										All available integrations have already been added.
									</Text>
								) : (
									addableIntegrations.map((type) => {
										const metadata = integrationTypeMetadata[type];
										return (
											<button
												key={type}
												type="button"
												className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-neutral-50"
												onClick={() => handleAddIntegration(type)}
											>
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
													<metadata.Icon className="h-4 w-4 text-neutral-600" />
												</div>
												<div className="flex min-w-0 flex-1 flex-col">
													<Text as="span" variant="bodyMd" fontWeight="medium">
														{metadata.label}
													</Text>
													<Text as="span" variant="bodySm" tone="subdued">
														{metadata.description}
													</Text>
												</div>
											</button>
										);
									})
								)}
							</div>
						</Popover>
					</div>
				</PanelHeader>
				<div className="flex-1 overflow-auto">
					{connectedIntegrations.length === 0 ? (
						<div className="m-4 rounded-lg border border-dashed border-neutral-200 px-4 py-6">
							<Text as="p" variant="bodyMd" tone="subdued">
								Add an integration to start tracking pageviews and clicks.
							</Text>
						</div>
					) : (
						<div>
							{connectedIntegrations.map((integration) => {
								const metadata = integrationTypeMetadata[integration.type];
								const isSelected = selectedIntegrationId === integration.id;

								return (
									<React.Fragment key={integration.id}>
										<button
											type="button"
											className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 ${
												isSelected ? 'bg-neutral-100' : ''
											}`}
											onClick={() => handleIntegrationSelect(integration.id)}
										>
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
												<metadata.Icon className="h-5 w-5 text-neutral-600" />
											</div>
											<div className="flex min-w-0 flex-1 flex-col">
												<Text as="span" variant="bodyMd" fontWeight="medium" truncate>
													{integration.title}
												</Text>
												<Text as="span" variant="bodySm" tone="subdued" truncate>
													{integration.subtitle}
												</Text>
											</div>
											<s-badge tone={integration.statusTone}>{integration.statusLabel}</s-badge>
										</button>
										<div className="h-px bg-neutral-200" />
									</React.Fragment>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsIntegrationsPanelProps {
	editor: TPageEditor;
}
