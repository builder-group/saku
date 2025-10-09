import { TFlatSite } from '@repo/editor';
import { Button, Text, TextField } from '@shopify/polaris';
import { RequestError } from 'feature-fetch';
import React from 'react';
import { coreApiClient } from '@/environment';
import { useConfetti } from '@/hooks';
import { createShopifyTokenMiddleware } from '@/lib';
import { TPageEditor } from '../../../../../lib';

export const OverrideWithExternalSiteSection: React.FC<TOverrideWithExternalSiteSectionProps> = (
	props
) => {
	const { title, description, helpText, editor } = props;

	const [url, setUrl] = React.useState('');
	const [isOverriding, setIsOverriding] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const triggerConfetti = useConfetti();

	const isOverrideDisabled = React.useMemo(() => {
		return isOverriding || !url.trim();
	}, [isOverriding, url]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleOverride = React.useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (isOverrideDisabled) {
				return;
			}

			setIsOverriding(true);
			setError(null);

			const [isParseOk, parseErr, parseResponse] = await coreApiClient.get(
				'/v1/site/parse/external',
				{
					queryParams: {
						url: url.trim()
					},
					requestMiddlewares: [createShopifyTokenMiddleware(editor.shopify)]
				}
			);
			if (!isParseOk) {
				const status = parseErr instanceof RequestError ? parseErr.status : undefined;
				switch (status) {
					case 404:
						setError(`Could not find external site. Please check the URL and try again.`);
						break;
					default:
						setError(`Failed to parse external site.`);
				}
				setIsOverriding(false);
				return;
			}

			editor.overrideWith(parseResponse.data.content as unknown as TFlatSite);
			editor.shopify.toast.show('Site overridden successfully', {
				action: 'Publish',
				onAction: async () => {
					const isPublished = await editor.publishSite();
					if (isPublished) {
						triggerConfetti();
					}
				}
			});
			setIsOverriding(false);
		},
		[isOverrideDisabled, url, editor, triggerConfetti]
	);

	const handleUrlChange = React.useCallback((newUrl: string) => {
		setUrl(newUrl);
		setError(null);
	}, []);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<form
			onSubmit={handleOverride}
			className="overflow-hidden rounded-lg border border-neutral-300 bg-white"
		>
			<div className="space-y-5 p-5 sm:p-8">
				<div className="space-y-3">
					<div>
						<Text as="h2" variant="headingMd">
							{title}
						</Text>
					</div>
					<div>
						<Text as="p" variant="bodySm" tone="subdued">
							{description}
						</Text>
					</div>
				</div>

				<div className="max-w-md">
					<TextField
						label="Site URL"
						value={url}
						onChange={handleUrlChange}
						placeholder="https://linkpop.com/johndoe"
						disabled={isOverriding}
						autoComplete="off"
						error={error ?? undefined}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between gap-4 border-t border-neutral-300 bg-neutral-50 px-5 py-3 sm:px-8">
				{helpText != null && (
					<div>
						<Text as="p" variant="bodySm" tone="subdued">
							{helpText}
						</Text>
					</div>
				)}
				<div className="ml-auto flex-shrink-0">
					<Button submit loading={isOverriding} disabled={isOverrideDisabled}>
						Override
					</Button>
				</div>
			</div>
		</form>
	);
};

interface TOverrideWithExternalSiteSectionProps {
	title: string;
	description: string;
	helpText?: string;
	editor: TPageEditor;
}
