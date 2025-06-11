import { useLoaderData } from '@remix-run/react';
import { TitleBar } from '@shopify/app-bridge-react';
import {
	Badge,
	BlockStack,
	Box,
	Button,
	Card,
	InlineStack,
	Layout,
	Page as PolarisPage,
	Text,
	TextField
} from '@shopify/polaris';
import { ExternalIcon } from '@shopify/polaris-icons';
import React from 'react';
import { FeedbackCard, GetInTouchCard, SitePreview } from '../../components';
import { appConfig, shopify } from '../../environment/.server';
import { useEditorModal } from '../../features/editor';
import { TLoaderFunction } from '../../types';

const Page: React.FC = () => {
	const { shop, appEnv } = useLoaderData<typeof loader>();

	const bioUrl = React.useMemo(
		() => (shop.domain != null ? `https://${shop.domain}/a/saku/bio` : null),
		[shop.domain]
	);

	const { Modal: EditorModal, isOpenState: isEditorOpenState } = useEditorModal();

	// =========================================================================
	// Events
	// =========================================================================

	const handleCustomizeBio = React.useCallback(() => {
		isEditorOpenState.set(true);
	}, [isEditorOpenState]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<PolarisPage>
			<TitleBar title="Saku Link In Bio">
				<button variant="primary" onClick={handleCustomizeBio}>
					Customize bio
				</button>
				{bioUrl != null && (
					<button
						onClick={() => {
							// TitleBar buttons in embedded apps can't use <a> tags - browser blocks them
							// window.open() with noopener,noreferrer bypasses iframe security restrictions
							window.open(bioUrl, '_blank', 'noopener,noreferrer');
						}}
					>
						View your bio
					</button>
				)}
			</TitleBar>

			<EditorModal />

			<Layout>
				<Layout.Section>
					{/* Bio Template Preview */}
					<Card padding="0">
						<BlockStack gap="0">
							{/* Large Preview Section */}
							<SitePreview className="mx-4 mt-4" url={bioUrl ?? ''} />

							{/* Theme List Item */}
							<Box padding="400">
								<InlineStack align="space-between" blockAlign="center" gap="400">
									{/* Thumbnail and Content Row */}
									<InlineStack gap="300" blockAlign="center">
										{/* Small Thumbnail */}
										<div className="h-16 w-24 rounded-md bg-gray-200" />

										{/* Content */}
										<BlockStack gap="100" inlineAlign="start">
											<InlineStack gap="200" blockAlign="center" wrap>
												<Text as="h3" variant="headingMd">
													default-bio
												</Text>
												<Badge tone="success">Current</Badge>
											</InlineStack>
											<Text as="p" variant="bodyMd" tone="subdued">
												Last Updated: Today
											</Text>
										</BlockStack>
									</InlineStack>

									{/* Action Buttons */}
									<Button variant="primary" onClick={handleCustomizeBio}>
										Customize
									</Button>
								</InlineStack>
							</Box>
						</BlockStack>
					</Card>
				</Layout.Section>

				<Layout.Section variant="oneThird">
					<BlockStack gap="500">
						{/* Your LinkShop URL */}
						<Card>
							<BlockStack gap="300">
								<InlineStack align="space-between" blockAlign="center">
									<Text as="h2" variant="headingMd">
										Your Link In Bio
									</Text>
									{bioUrl != null ? (
										<Badge tone="success">Active</Badge>
									) : (
										<Badge tone="warning">Inactive</Badge>
									)}
								</InlineStack>

								{bioUrl != null ? (
									<TextField
										label=""
										value={bioUrl}
										readOnly
										autoComplete="off"
										connectedRight={
											<Button
												icon={ExternalIcon}
												url={bioUrl}
												external
												target="_blank"
												accessibilityLabel="Visit your link in bio page"
											/>
										}
									/>
								) : (
									<Button
										variant="primary"
										onClick={() => {
											// TODO
										}}
									>
										Activate
									</Button>
								)}
							</BlockStack>
						</Card>

						<FeedbackCard email={appEnv.support.email} reviewUrl={appEnv.distribution.shopify} />
						<GetInTouchCard
							version={appEnv.version}
							discordUrl={appEnv.social.discord}
							email={appEnv.support.email}
						/>
					</BlockStack>
				</Layout.Section>
			</Layout>
		</PolarisPage>
	);
};

export default Page;

export const loader: TLoaderFunction<TLoaderData> = async ({ request }) => {
	const { session } = await shopify.authenticate.admin(request);

	return {
		shop: {
			domain: session.shop
		},
		appEnv: {
			version: appConfig.packageVersion,
			social: {
				discord: appConfig.social.discord
			},
			support: {
				email: appConfig.support.email
			},
			distribution: {
				shopify: appConfig.distribution.shopify
			}
		}
	};
};

interface TLoaderData {
	shop: {
		domain: string;
	};
	appEnv: {
		version: string;
		social: {
			discord: string;
		};
		support: {
			email: string;
		};
		distribution: {
			shopify: string;
		};
	};
}
