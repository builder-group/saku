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
import { coreApiClient } from '@/environment';
import { appConfig, shopify, shopifyConfig } from '@/environment/.server';
import { getSessionTokenFromRequest } from '@/lib/.server';
import { usePageEditorModal } from '@/routes/app.modal.page-editor.$/PageEditorModal';
import { TLoaderFunction } from '@/types';

const Page: React.FC = () => {
	const { env, site } = useLoaderData<typeof loader>();

	const { Modal: EditorModal, isOpenState: isEditorOpenState } = usePageEditorModal({
		siteId: site?.id ?? '',
		title: site?.displayName ?? ''
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
		<>
			<EditorModal />

			<PolarisPage>
				<TitleBar title="Saku Link In Bio">
					<button variant="primary" onClick={handleCustomizeBio}>
						{site != null ? 'Customize' : 'Create'}
					</button>
					{site?.url != null && (
						<button
							onClick={() => {
								// TitleBar buttons in embedded apps can't use <a> tags - browser blocks them
								// window.open() with noopener,noreferrer bypasses iframe security restrictions
								window.open(site.url, '_blank', 'noopener,noreferrer');
							}}
						>
							Visit
						</button>
					)}
				</TitleBar>

				<Layout>
					<Layout.Section>
						{/* Bio Preview Card */}
						<Card>
							{site != null ? (
								<>
									<SitePreview url={site.url} />

									{/* Theme List Item */}
									<div className="mt-4 flex items-center justify-between gap-4">
										<div className="flex items-center gap-3">
											{/* Small Thumbnail */}
											<div className="h-16 w-24 rounded-md bg-gray-200" />

											{/* Content */}
											<div className="flex flex-col items-start gap-1">
												<div className="flex flex-wrap items-center gap-2">
													<Text as="h3" variant="headingMd">
														{site.displayName ?? site.handle}
													</Text>
													<Badge tone="success">Current</Badge>
												</div>
												<Text as="p" variant="bodyMd" tone="subdued">
													Last Updated:{' '}
													{site.updatedAt != null
														? new Date(site.updatedAt).toLocaleDateString()
														: 'Never'}
												</Text>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex items-center gap-2">
											<Button
												icon={ViewIcon}
												variant="secondary"
												url={site.url}
												target="_blank"
												accessibilityLabel="Visit your Link In Bio page"
											/>
											<Button variant="primary" onClick={handleCustomizeBio}>
												Customize
											</Button>
										</div>
									</div>
								</>
							) : (
								<div className="mt-4 flex flex-col items-center gap-4 p-4">
									<Text as="h3" variant="headingMd">
										No Bio Site Found
									</Text>
									<Button
										variant="primary"
										onClick={() => {
											// TODO
										}}
									>
										Create Bio Site
									</Button>
								</div>
							)}
						</Card>
					</Layout.Section>

					<Layout.Section variant="oneThird">
						<div className="flex flex-col gap-5">
							{/* Your Link Card */}
							{site != null && (
								<Card>
									<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between">
											<Text as="h2" variant="headingMd">
												Your Link
											</Text>
											<Badge tone="success">Current</Badge>
										</div>

										<TextField
											label=""
											value={site.url}
											readOnly
											autoComplete="off"
											connectedRight={<ClipboardButton textToCopy={site.url} />}
										/>
									</div>
								</Card>
							)}
							<FeedbackCard email={env.support.email} reviewUrl={env.distribution.shopify} />
							<GetInTouchCard email={env.support.email} discordUrl={env.social.discord} />
						</div>
					</Layout.Section>
				</Layout>
			</PolarisPage>
		</>
	);
};

export default Page;

export const loader: TLoaderFunction<TLoaderData> = async ({ request }) => {
	const { session } = await shopify.authenticate.admin(request);
	const sessionToken = getSessionTokenFromRequest(request);
	const env = {
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
	};

	const sitesResult = await coreApiClient.get('/v1/shopify/site', {
		headers: {
			Authorization: `Bearer ${sessionToken}`
		}
	});
	if (sitesResult.isErr()) {
		return {
			site: null,
			env
		};
	}

	return {
		site:
			sitesResult.value.data.map((site) => ({
				id: site.id,
				handle: site.handle,
				url: `${shopifyConfig.proxy.url(session.shop)}/${site.handle}`,
				displayName: site.displayName,
				updatedAt: site.updatedAt
			}))[0] ?? null,
		env
	};
};

interface TLoaderData {
	site: TSite | null;
	env: {
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

interface TSite {
	id: string;
	handle: string;
	url: string;
	displayName?: string;
	updatedAt: string;
}
