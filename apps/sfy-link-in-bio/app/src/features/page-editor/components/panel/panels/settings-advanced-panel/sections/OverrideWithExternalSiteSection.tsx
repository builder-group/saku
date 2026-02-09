import { isFlatSite, isHierarchicalSite, TFlatSite, toFlatSite } from '@repo/editor';
import { Button, Select, Text, TextField } from '@shopify/polaris';
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

	const [inputMode, setInputMode] = React.useState<TInputMode>('url');
	const [url, setUrl] = React.useState('');
	const [jsonInput, setJsonInput] = React.useState('');
	const [isOverriding, setIsOverriding] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const triggerConfetti = useConfetti();

	const isOverrideDisabled = React.useMemo(() => {
		if (isOverriding) {
			return true;
		}
		switch (inputMode) {
			case 'url':
				return !url.trim();
			case 'json':
				return !jsonInput.trim();
			default:
				return true;
		}
	}, [isOverriding, inputMode, url, jsonInput]);

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

			let parsedSite: TFlatSite;

			switch (inputMode) {
				case 'url': {
					// Parse external site from URL
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
					parsedSite = parseResponse.data.content as unknown as TFlatSite;
					break;
				}
				case 'json': {
					// Parse JSON input
					let parsed: unknown;
					try {
						parsed = JSON.parse(jsonInput.trim());
					} catch {
						setError(`Invalid JSON. Please check your JSON syntax and try again.`);
						setIsOverriding(false);
						return;
					}

					// Check if it's a hierarchical site or flat site
					if (isHierarchicalSite(parsed)) {
						parsedSite = toFlatSite(parsed);
					} else if (isFlatSite(parsed)) {
						parsedSite = parsed;
					} else {
						setError(`The JSON format is invalid. Please use a valid Saku export or LinkPop URL.`);
						setIsOverriding(false);
						return;
					}

					// Clear integrations
					parsedSite.integrations = {};

					break;
				}
				default: {
					setError(`Unsupported input mode.`);
					setIsOverriding(false);
					return;
				}
			}

			// Upload image assets to Shopify
			const imageAssets = Object.values(parsedSite.assets).filter(
				(asset) => asset.type === 'image'
			);
			const [isUploadOk, uploadErr, uploadResponse] = await coreApiClient.post(
				'/v1/shopify/site/assets/upload',
				{ assets: imageAssets as unknown as { [key: string]: unknown }[] },
				{
					requestMiddlewares: [createShopifyTokenMiddleware(editor.shopify)]
				}
			);
			if (!isUploadOk) {
				setError(`Failed to upload assets: ${uploadErr.message}`);
				setIsOverriding(false);
				return;
			}

			// Merge uploaded asset URLs back into site
			for (const uploadedAsset of uploadResponse.data.uploadedAssets) {
				const asset = parsedSite.assets[uploadedAsset.originalHash];
				if (asset != null) {
					asset.storage = {
						type: 'url',
						url: uploadedAsset.url
					};
				}
			}

			// Override with parsed site
			editor.overrideWith(parsedSite, {
				keepShopIntegration: true
			});

			editor.shopify.toast.show('Bio page updated successfully', {
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
		[isOverrideDisabled, inputMode, url, jsonInput, editor, triggerConfetti]
	);

	const handleUrlChange = React.useCallback((newUrl: string) => {
		setUrl(newUrl);
		setError(null);
	}, []);

	const handleJsonInputChange = React.useCallback((newJson: string) => {
		setJsonInput(newJson);
		setError(null);
	}, []);

	const handleInputModeChange = React.useCallback((value: string) => {
		const mode = value as TInputMode;
		setInputMode(mode);
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

				<div className="space-y-4">
					<div className="max-w-md">
						<Select
							label="Input source"
							labelHidden
							options={[
								{ label: 'Paste URL', value: 'url' },
								{ label: 'Paste JSON', value: 'json' }
							]}
							value={inputMode}
							onChange={handleInputModeChange}
							disabled={isOverriding}
						/>
					</div>

					{inputMode === 'url' ? (
						<div className="max-w-md">
							<TextField
								label="Page URL"
								value={url}
								onChange={handleUrlChange}
								placeholder="https://linkpop.com/johndoe"
								disabled={isOverriding}
								autoComplete="off"
								error={error ?? undefined}
							/>
						</div>
					) : inputMode === 'json' ? (
						<div className="w-full [&_textarea]:max-h-64 [&_textarea]:overflow-y-auto">
							<TextField
								label="Saku or LinkPop JSON"
								value={jsonInput}
								onChange={handleJsonInputChange}
								placeholder='{"version": "v0.0.2", "rootId": "...", ...}'
								disabled={isOverriding}
								autoComplete="off"
								multiline={6}
								error={error ?? undefined}
							/>
						</div>
					) : null}
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
				<div className="ml-auto shrink-0">
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

type TInputMode = 'url' | 'json';
