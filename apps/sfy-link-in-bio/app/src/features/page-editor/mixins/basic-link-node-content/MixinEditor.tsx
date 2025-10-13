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

	const content = useFeatureState(state);
	const isEnhancing = useFeatureState(cx.isEnhancingBundle);

	const [displayUrl, setDisplayUrl] = React.useState(content.url);
	const [imageError, setImageError] = React.useState<string | null>(null);

	const image = React.useMemo(() => {
		const asset = cx.editor.getImageAsset(
			content.userImage === undefined ? content.image : content.userImage
		);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.userImage, content.image, cx]);

	const titleValue = React.useMemo(() => {
		return content.userTitle ?? content.title;
	}, [content.userTitle, content.title]);
	const descriptionValue = React.useMemo(() => {
		return content.userDescription ?? content.description;
	}, [content.userDescription, content.description]);

	const canResetTitle = React.useMemo(
		() => content.title != null && content.userTitle != null && content.userTitle !== content.title,
		[content.userTitle, content.title]
	);
	const canResetDescription = React.useMemo(
		() =>
			content.description != null &&
			content.userDescription != null &&
			content.userDescription !== content.description,
		[content.userDescription, content.description]
	);
	const canResetImage = React.useMemo(
		() =>
			content.image !== undefined &&
			content.userImage !== undefined &&
			content.userImage !== content.image,
		[content.userImage, content.image]
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
			state._v.userTitle = value;
			state._notify();
		},
		[state]
	);

	const handleTitleReset = React.useCallback(() => {
		state._v.userTitle = undefined;
		state._notify();
	}, [state]);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			state._v.userDescription = value;
			state._notify();
		},
		[state]
	);

	const handleDescriptionReset = React.useCallback(() => {
		state._v.userDescription = undefined;
		state._notify();
	}, [state]);

	const handleImageChange = React.useCallback(
		(image: TImageUploadEvent) => {
			switch (image.type) {
				case 'Changed': {
					const hash = cx.editor.registerImage(image.url, image.fileName);
					if (hash != null) {
						state._v.userImage = hash;
						state._notify();
					}
					break;
				}
				case 'Removed': {
					state._v.userImage = null;
					state._notify();
					break;
				}
			}
		},
		[cx, state]
	);

	const handleImageReset = React.useCallback(() => {
		state._v.userImage = undefined;
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
		<div className={cn('space-y-3 px-4 py-3', className)}>
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

			{/* Image */}
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<Text as="span" variant="bodySm" tone="subdued">
						Image
					</Text>
					{canResetImage && (
						<Button variant="plain" size="micro" onClick={handleImageReset}>
							Reset
						</Button>
					)}
				</div>
				<ImageUploadField image={image} onChange={handleImageChange} onError={setImageError} />
				{imageError != null && <InlineError message={imageError} fieldID="image-upload-error" />}
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
