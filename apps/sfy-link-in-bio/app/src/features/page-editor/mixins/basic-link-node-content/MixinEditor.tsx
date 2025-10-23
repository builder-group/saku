import { TBasicLinkNodeContentMixin } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { Button, InlineError, Text, TextField } from '@shopify/polaris';
import { useFeatureState, useSubscriber } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TResult } from 'tuple-result';
import { AppError, cn } from '@/lib';
import { ImageUploadField, TImageUploadEvent } from '../../../../components';
import { TPageEditor } from '../../lib';

export const BasicLinkNodeContentMixinEditor = (props: TBasicLinkNodeContentMixinEditorProps) => {
	const { state, cx, className } = props;

	const { url, user, metadata } = useFeatureState(state);
	const isEnhancing = useFeatureState(cx.isEnhancingBundle);

	const [displayUrl, setDisplayUrl] = React.useState(url);

	const [thumbnailError, setThumbnailError] = React.useState<string | null>(null);
	const thumbnail = React.useMemo(() => {
		const asset = cx.editor.getImageAsset(
			user.thumbnail === undefined ? metadata.thumbnail : user.thumbnail
		);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [user.thumbnail, metadata.thumbnail, cx]);

	const titleValue = React.useMemo(() => {
		return user.title ?? metadata.title;
	}, [user.title, metadata.title]);
	const descriptionValue = React.useMemo(() => {
		return user.description ?? metadata.description;
	}, [user.description, metadata.description]);

	const canResetTitle = React.useMemo(
		() => metadata.title != null && user.title != null && user.title !== metadata.title,
		[user.title, metadata.title]
	);
	const canResetDescription = React.useMemo(
		() =>
			metadata.description != null &&
			user.description != null &&
			user.description !== metadata.description,
		[user.description, metadata.description]
	);
	const canResetThumbnail = React.useMemo(
		() =>
			metadata.thumbnail !== undefined &&
			user.thumbnail !== undefined &&
			user.thumbnail !== metadata.thumbnail,
		[user.thumbnail, metadata.thumbnail]
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleUrlChange = React.useCallback((value: string) => {
		setDisplayUrl(value);
	}, []);

	const handleUrlBlur = React.useCallback(() => {
		cx.updateUrlAndEnhance(displayUrl).then((result) => {
			if (result.isErr()) {
				cx.shopify.toast.show('Failed to update URL and enhance content', { duration: 3000 });
			}
		});
	}, [cx, displayUrl]);

	const handleTitleChange = React.useCallback(
		(value: string) => {
			state._v.user.title = value;
			state._notify();
		},
		[state]
	);

	const handleTitleReset = React.useCallback(() => {
		state._v.user.title = undefined;
		state._notify();
	}, [state]);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			state._v.user.description = value;
			state._notify();
		},
		[state]
	);

	const handleDescriptionReset = React.useCallback(() => {
		state._v.user.description = undefined;
		state._notify();
	}, [state]);

	const handleThumbnailChange = React.useCallback(
		(event: TImageUploadEvent) => {
			switch (event.type) {
				case 'Changed': {
					const hash = cx.editor.registerImage(event.url, event.fileName);
					if (hash != null) {
						state._v.user.thumbnail = hash;
						state._notify();
					}
					break;
				}
				case 'Removed': {
					state._v.user.thumbnail = null;
					state._notify();
					break;
				}
			}
		},
		[cx, state]
	);

	const handleThumbnailReset = React.useCallback(() => {
		state._v.user.thumbnail = undefined;
		state._notify();
	}, [state]);

	// =========================================================================
	// Effects
	// =========================================================================

	useSubscriber(
		state,
		({ value, source }) => {
			if (source !== 'apply-url-and-enhance') {
				setDisplayUrl(value.url);
			}
		},
		[cx]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4', className)}>
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Content {isEnhancing && '(enhancing...)'}
				</Text>
				<Button
					variant="plain"
					size="micro"
					onClick={() => cx.enhanceBundle()}
					disabled={isEnhancing}
				>
					{isEnhancing ? 'Enhancing...' : 'Enhance'}
				</Button>
			</div>

			{/* URL */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					URL
				</Text>
				<TextField
					id="url-field"
					label="URL"
					labelHidden
					value={displayUrl}
					onChange={handleUrlChange}
					onBlur={handleUrlBlur}
					autoComplete="off"
					placeholder="https://example.com"
					type="url"
				/>
			</div>

			{/* Title */}
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<Text as="span" variant="bodySm" tone="subdued">
						Title
					</Text>
					{canResetTitle && (
						<Button variant="plain" size="micro" onClick={handleTitleReset}>
							Reset
						</Button>
					)}
				</div>
				<TextField
					id="title-field"
					label="Title"
					labelHidden
					value={titleValue}
					onChange={handleTitleChange}
					autoComplete="off"
					placeholder="Link title"
				/>
			</div>

			{/* Description */}
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<Text as="span" variant="bodySm" tone="subdued">
						Description
					</Text>
					{canResetDescription && (
						<Button variant="plain" size="micro" onClick={handleDescriptionReset}>
							Reset
						</Button>
					)}
				</div>
				<TextField
					id="description-field"
					label="Description"
					labelHidden
					value={descriptionValue}
					onChange={handleDescriptionChange}
					autoComplete="off"
					placeholder="Link description"
				/>
			</div>

			{/* Thumbnail */}
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<Text as="span" variant="bodySm" tone="subdued">
						Thumbnail
					</Text>
					{canResetThumbnail && (
						<Button variant="plain" size="micro" onClick={handleThumbnailReset}>
							Reset
						</Button>
					)}
				</div>
				<ImageUploadField
					image={thumbnail}
					onChange={handleThumbnailChange}
					onError={setThumbnailError}
				/>
				{thumbnailError != null && (
					<InlineError message={thumbnailError} fieldID="thumbnail-upload-error" />
				)}
			</div>
		</div>
	);
};

interface TBasicLinkNodeContentMixinEditorProps {
	state: TState<TBasicLinkNodeContentMixin['value'], any>;
	cx: {
		editor: TPageEditor;
		isEnhancingBundle: TState<boolean, []>;
		shopify: ShopifyGlobal;
		updateUrlAndEnhance: (newUrl: string) => Promise<TResult<void, AppError>>;
		enhanceBundle: () => Promise<TResult<void, AppError>>;
	};
	className?: string;
}
