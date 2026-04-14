import { TIntegration } from '@repo/editor';
import React from 'react';
import { FacebookIcon, GoogleIcon, ShopifyIcon } from '@/components';

export const integrationTypeMetadata = {
	'shopify': {
		label: 'Shopify',
		description: 'Connected storefront integration for products and checkout.',
		Icon: ShopifyIcon
	},
	'ga4': {
		label: 'Google Analytics',
		description: 'Track pageviews and click events with a GA4 Measurement ID.',
		Icon: GoogleIcon
	},
	'meta-pixel': {
		label: 'Meta Pixel',
		description: 'Track pageviews and click events with a Meta Pixel ID.',
		Icon: FacebookIcon
	}
} satisfies Record<
	TIntegration['type'],
	{
		label: string;
		description: string;
		Icon: React.ComponentType<React.ComponentProps<'svg'>>;
	}
>;

export const integrationTypeOrder = {
	'shopify': 0,
	'ga4': 1,
	'meta-pixel': 2
} satisfies Record<TIntegration['type'], number>;

export const addableIntegrationTypes = ['ga4', 'meta-pixel'] as const;

export type TAddableIntegrationType = (typeof addableIntegrationTypes)[number];
