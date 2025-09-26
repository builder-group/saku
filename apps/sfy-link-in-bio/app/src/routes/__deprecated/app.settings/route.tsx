import {
	BlockStack,
	Box,
	Button,
	Card,
	Divider,
	InlineGrid,
	InlineStack,
	Link,
	Text,
	useBreakpoints
} from '@shopify/polaris';
import React from 'react';
import { useLoaderData } from 'react-router';
import { ApiHealthBadge } from '@/components';
import { appConfig } from '@/environment';
import { TLoaderFunction } from '@/types';

// https://polaris-react.shopify.com/patterns/app-settings-layout
const SettingsPage: React.FC = () => {
	const { smUp } = useBreakpoints();
	const { env } = useLoaderData<typeof loader>();

	return (
		<s-page>
			<ui-title-bar title="Settings"></ui-title-bar>
			<BlockStack gap={{ xs: '800', sm: '400' }}>
				{/* App Info Section */}
				<InlineGrid columns={{ xs: '1fr', md: '2fr 5fr' }} gap="400">
					<Box
						as="section"
						paddingInlineStart={{ xs: '400', sm: '0' }}
						paddingInlineEnd={{ xs: '400', sm: '0' }}
					>
						<BlockStack gap="400">
							<Text as="h3" variant="headingMd">
								App Info
							</Text>
							<Text as="p" variant="bodyMd">
								Version information and system status
							</Text>
						</BlockStack>
					</Box>
					<Card roundedAbove="sm">
						<BlockStack gap="300">
							<InlineStack align="space-between" blockAlign="center">
								<Text variant="bodyMd" as="span" tone="subdued">
									App Version
								</Text>
								<s-badge tone="info">{env.version}</s-badge>
							</InlineStack>

							<Divider />

							<InlineStack align="space-between" blockAlign="center">
								<Text variant="bodyMd" as="span" tone="subdued">
									API Status
								</Text>
								<ApiHealthBadge />
							</InlineStack>
						</BlockStack>
					</Card>
				</InlineGrid>

				{smUp ? <Divider /> : null}

				{/* Contact Us Section */}
				<InlineGrid columns={{ xs: '1fr', md: '2fr 5fr' }} gap="400">
					<Box
						as="section"
						paddingInlineStart={{ xs: '400', sm: '0' }}
						paddingInlineEnd={{ xs: '400', sm: '0' }}
					>
						<BlockStack gap="400">
							<Text as="h3" variant="headingMd">
								Contact Us
							</Text>
							<Text as="p" variant="bodyMd">
								Get help and support for your app
							</Text>
						</BlockStack>
					</Box>
					<Card roundedAbove="sm">
						<BlockStack gap="300">
							<InlineStack align="space-between" blockAlign="center">
								<BlockStack gap="100">
									<Text variant="bodyMd" as="span" tone="subdued">
										Email Support
									</Text>
									<Text variant="bodySm" as="span" tone="subdued">
										<Link url={`mailto:${env.support.email}`} target="_blank">
											{env.support.email}
										</Link>
									</Text>
								</BlockStack>
								<Button
									variant="secondary"
									size="slim"
									url={`mailto:${env.support.email}`}
									target="_blank"
								>
									Contact
								</Button>
							</InlineStack>

							<Divider />

							<InlineStack align="space-between" blockAlign="center">
								<BlockStack gap="100">
									<Text variant="bodyMd" as="span" tone="subdued">
										Discord Community
									</Text>
									<Text variant="bodySm" as="span" tone="subdued">
										<Link url={env.social.discord} target="_blank">
											discord.gg/{env.social.discord.split('/').pop()}
										</Link>
									</Text>
								</BlockStack>
								<Button variant="secondary" size="slim" url={env.social.discord} target="_blank">
									Join
								</Button>
							</InlineStack>
						</BlockStack>
					</Card>
				</InlineGrid>
			</BlockStack>
		</s-page>
	);
};

export default SettingsPage;

export const loader: TLoaderFunction<TLoaderData> = async () => {
	const env = {
		version: appConfig.version,
		social: {
			discord: appConfig.help.discord
		},
		support: {
			email: appConfig.help.email
		}
	};

	return { env };
};

interface TLoaderData {
	env: {
		version: string;
		social: {
			discord: string;
		};
		support: {
			email: string;
		};
	};
}
