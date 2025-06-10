import { useLoaderData } from '@remix-run/react';
import { TitleBar, useAppBridge } from '@shopify/app-bridge-react';
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
import { FeedbackCard, GetInTouchCard, SitePreview } from '../components';
import { authenticate } from '../shopify.server';
import { TLoaderFunction } from '../types';

const Page: React.FC = () => {
	const { shop } = useLoaderData<typeof loader>();
	const shopify = useAppBridge();

	const bioUrl = React.useMemo(
		() => (shop.domain != null ? `https://${shop.domain}/a/bio` : null),
		[shop.domain]
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleEditBio = React.useCallback(() => {
		// TODO:
		shopify.toast.show('Bio editor coming soon!');
	}, [shopify]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<PolarisPage>
			<TitleBar title="Saku Link In Bio">
				<button variant="primary" onClick={handleEditBio}>
					Customize bio
				</button>
				{bioUrl != null ? (
					<button
						onClick={() => {
							// TitleBar buttons in embedded apps can't use <a> tags - browser blocks them
							// window.open() with noopener,noreferrer bypasses iframe security restrictions
							window.open(bioUrl, '_blank', 'noopener,noreferrer');
						}}
					>
						View your bio
					</button>
				) : null}
			</TitleBar>

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
									<Button variant="primary" onClick={handleEditBio}>
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

						<FeedbackCard />
						<GetInTouchCard />
					</BlockStack>
				</Layout.Section>
			</Layout>
		</PolarisPage>
	);
};

export default Page;

export const loader: TLoaderFunction<TLoaderData> = async ({ request }) => {
	const { session } = await authenticate.admin(request);

	return {
		shop: {
			domain: session.shop
		}
	};
};

interface TLoaderData {
	shop: {
		domain: string;
	};
}
