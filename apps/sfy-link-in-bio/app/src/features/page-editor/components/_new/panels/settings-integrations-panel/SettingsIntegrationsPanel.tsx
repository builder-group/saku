import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ResizablePanel, ShopifyIcon } from '@/components';
import { createDisplayNameFromShop } from '@/lib';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../../PanelHeader';
import { Placeholder } from './Placeholder';

export const SettingsIntegrationsPanel: React.FC<TSettingsIntegrationsPanelProps> = (props) => {
	const { editor } = props;

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
			const width = rect.right - rect.left;
			if (width <= 0) {
				// Note: Return default sizes instead of null to prevent the panel from being hidden on hot reload
				return {
					minSize: 20,
					defaultSize: 25,
					maxSize: 30
				};
			}

			const toPercent = (pixels: number) => (pixels / width) * 100;

			return {
				minSize: toPercent(300), // ~ 20
				defaultSize: toPercent(375), // ~ 25
				maxSize: toPercent(450) // ~ 30
			};
		},
		[],
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
		<ResizablePanel minSize={sizes.minSize} defaultSize={sizes.defaultSize} maxSize={sizes.maxSize}>
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
}
