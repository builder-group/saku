import { useLoaderData } from '@remix-run/react';
import { TitleBar } from '@shopify/app-bridge-react';
import {
	Badge,
	Button,
	Card,
	Layout,
	Page as PolarisPage,
	Text,
	TextField
} from '@shopify/polaris';
import React from 'react';
import { ClipboardButton, FeedbackCard, GetInTouchCard, SitePreview, ViewIcon } from '@/components';
import { appConfig, shopify } from '@/environment/.server';
import { useEditorModal } from '@/features/editor';
import { TLoaderFunction } from '@/types';
import { coreApiClient } from '../../environment';

const Page: React.FC = () => {
	const { shop, appEnv } = useLoaderData<typeof loader>();

	const bioUrl = React.useMemo(
		() => (shop.domain != null ? `https://${shop.domain}/a/saku/bio` : null),
		[shop.domain]
	);

	const { Modal: EditorModal, isOpenState: isEditorOpenState } = useEditorModal({
		src: '/app/modal/editor'
	});

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
					Customize
				</button>
				{bioUrl != null && (
					<button
						onClick={() => {
							// TitleBar buttons in embedded apps can't use <a> tags - browser blocks them
							// window.open() with noopener,noreferrer bypasses iframe security restrictions
							window.open(bioUrl, '_blank', 'noopener,noreferrer');
						}}
					>
						Visit
					</button>
				)}
			</TitleBar>

			<EditorModal />

			<Layout>
				<Layout.Section>
					{/* Bio Preview Card */}
					<Card>
						<SitePreview url={bioUrl ?? ''} />

						{/* Theme List Item */}
						<div className="mt-4 flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								{/* Small Thumbnail */}
								<div className="h-16 w-24 rounded-md bg-gray-200" />

								{/* Content */}
								<div className="flex flex-col items-start gap-1">
									<div className="flex flex-wrap items-center gap-2">
										<Text as="h3" variant="headingMd">
											default-bio
										</Text>
										<Badge tone="success">Current</Badge>
									</div>
									<Text as="p" variant="bodyMd" tone="subdued">
										Last Updated: Today
									</Text>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center gap-2">
								{bioUrl != null && (
									<Button
										icon={ViewIcon}
										variant="secondary"
										url={bioUrl}
										external
										target="_blank"
										accessibilityLabel="Visit your Link In Bio page"
									/>
								)}
								<Button variant="primary" onClick={handleCustomizeBio}>
									Customize
								</Button>
							</div>
						</div>
					</Card>
				</Layout.Section>

				<Layout.Section variant="oneThird">
					<div className="flex flex-col gap-5">
						{/* Your Link Card */}
						<Card>
							<div className="flex flex-col gap-3">
								<div className="flex items-center justify-between">
									<Text as="h2" variant="headingMd">
										Your Link
									</Text>
									{bioUrl != null ? (
										<Badge tone="success">Active</Badge>
									) : (
										<Badge tone="warning">Inactive</Badge>
									)}
								</div>

								{bioUrl != null ? (
									<TextField
										label=""
										value={bioUrl}
										readOnly
										autoComplete="off"
										connectedRight={<ClipboardButton textToCopy={bioUrl} />}
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
							</div>
						</Card>

						<FeedbackCard email={appEnv.support.email} reviewUrl={appEnv.distribution.shopify} />
						<GetInTouchCard
							version={appEnv.version}
							discordUrl={appEnv.social.discord}
							email={appEnv.support.email}
						/>
					</div>
				</Layout.Section>
			</Layout>
		</PolarisPage>
	);
};

export default Page;

export const loader: TLoaderFunction<TLoaderData> = async ({ request }) => {
	const { session } = await shopify.authenticate.admin(request);

	const healthResult = await coreApiClient.get('/v1/health');
	if (healthResult.isOk()) {
		console.log('[core-api] health check passed', healthResult.value.data);
	} else {
		console.log('[core-api] health check failed', healthResult.error.message);
	}

	return {
		shop: {
			domain: session.shop
		},
		appEnv: {
			version: appConfig.version,
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
