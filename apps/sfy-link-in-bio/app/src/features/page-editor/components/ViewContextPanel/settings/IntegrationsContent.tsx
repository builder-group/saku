import { Text } from '@shopify/polaris';
import React from 'react';
import { AccordionSection, ShopifyIcon } from '@/components';
import { createDisplayNameFromShop } from '@/lib';
import { TPageEditor } from '../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { IntegrationsContentPlaceholder } from './IntegrationsContentPlaceholder';

export const IntegrationsContent: React.FC<TIntegrationsContentProps> = (props) => {
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

	return (
		<div className="flex h-full flex-col">
			<PanelHeader>
				<Text as="h2" variant="headingMd">
					Integrations
				</Text>
			</PanelHeader>
			<div className="flex-1 overflow-auto">
				{!hasIntegrations && <IntegrationsContentPlaceholder />}

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
								{index < shopifyIntegrations.length - 1 && <div className="h-px bg-neutral-200" />}
							</React.Fragment>
						))}
					</AccordionSection>
				)}
			</div>
		</div>
	);
};

interface TIntegrationsContentProps {
	editor: TPageEditor;
}
