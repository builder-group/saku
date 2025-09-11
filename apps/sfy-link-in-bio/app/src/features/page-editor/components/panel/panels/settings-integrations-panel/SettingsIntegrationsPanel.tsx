import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ResizablePanel, ShopifyIcon } from '@/components';
import { createDisplayNameFromShop } from '@/lib';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { Placeholder } from './Placeholder';

export const SettingsIntegrationsPanel: React.FC<TSettingsIntegrationsPanelProps> = (props) => {
	const { editor, order } = props;

	const isMd = useEditorBreakpoint(editor, 'md');

	const { shopifyIntegrations, hasIntegrations } = React.useMemo(() => {
		const shopifyIntegrations: {
			id: string;
			shopId: string;
			displayName: string;
		}[] = [];

		for (const integration of Object.values(editor.integrationsMap)) {
			switch (integration.type) {
				case 'shopify': {
					shopifyIntegrations.push({
						id: integration.id,
						shopId: integration.shopId,
						displayName: createDisplayNameFromShop(integration.shopId)
					});
					break;
				}
				default:
				// do nothing
			}
		}

		return {
			shopifyIntegrations,
			hasIntegrations: shopifyIntegrations.length > 0
		};
	}, [editor.integrationsMap]);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			// Desktop (horizontal layout): Resizable based on width
			if (isMd) {
				const width = rect.right - rect.left;
				const toPercent = (pixels: number) => (pixels / (width > 0 ? width : 15)) * 100;
				return {
					minSize: toPercent(300), // ~ 20
					defaultSize: toPercent(405), // ~ 27
					maxSize: toPercent(525) // ~ 35
				};
			}

			// Mobile (vertical layout): Fixed height for navbar with icons
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
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			id="settings-integrations-panel"
			order={order}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
		>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						Integrations
					</Text>
				</PanelHeader>
				<div className="flex-1 overflow-auto">
					{!hasIntegrations && <Placeholder />}

					{/* Shopify Integrations */}
					{shopifyIntegrations.length > 0 && (
						<AccordionSection
							title={`Shopify (${shopifyIntegrations.length})`}
							defaultOpen={true}
							collapsibleClassName="px-0 space-y-3"
						>
							{shopifyIntegrations.map((integration, index) => (
								<React.Fragment key={integration.id}>
									<div className="flex items-center gap-2 px-2">
										<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-50">
											<ShopifyIcon className="h-5 w-5 text-neutral-600" />
										</div>
										<div className="flex min-w-0 flex-1 flex-col">
											<Text as="span" variant="bodyMd" fontWeight="medium" truncate>
												{integration.displayName}
											</Text>
											<Text as="span" variant="bodySm" tone="subdued" truncate>
												{integration.shopId}
											</Text>
										</div>
										<div className="ml-4">
											<s-badge tone="success">Connected</s-badge>
										</div>
									</div>
									{index < shopifyIntegrations.length - 1 && (
										<div className="h-px bg-neutral-200" />
									)}
								</React.Fragment>
							))}
						</AccordionSection>
					)}
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsIntegrationsPanelProps {
	editor: TPageEditor;
	order: number;
}
