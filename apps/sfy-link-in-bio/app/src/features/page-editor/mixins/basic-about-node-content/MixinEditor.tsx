import { TBasicAboutNodeContentMixin } from '@repo/editor';
import { InlineError, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { ImageUploadField, TImageUploadEvent } from '@/components';
import { cn } from '@/lib';
import { TPageEditor } from '../../lib';
import { ContactLinksSection } from './ContactLinksSection';

export const BasicAboutNodeContentMixinEditor = (props: TBasicAboutNodeContentMixinEditorProps) => {
	const { state, editor, className } = props;

	const content = useFeatureState(state);

	const [avatarError, setAvatarError] = React.useState<string | null>(null);
	const avatar = React.useMemo(() => {
		const asset = editor.getImageAsset(content.avatar);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.avatar, editor]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleTitleChange = React.useCallback(
		(value: string) => {
			state._v.title = value;
			state._notify();
		},
		[state]
	);

	const handleDescriptionChange = React.useCallback(
		(value: string) => {
			state._v.description = value.length > 0 ? value : undefined;
			state._notify();
		},
		[state]
	);

	const handleAvatarChange = React.useCallback(
		(event: TImageUploadEvent) => {
			switch (event.type) {
				case 'Changed': {
					const hash = editor.registerImage(event.url, {
						mimeType: event.mimeType,
						fileName: event.fileName
					});
					if (hash != null) {
						state._v.avatar = hash;
						state._notify();
					}
					break;
				}
				case 'Removed': {
					state._v.avatar = undefined;
					state._notify();
					break;
				}
			}
		},
		[state, editor]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className={cn('space-y-3 px-4', className)}>
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Content
				</Text>
			</div>

			{/* Avatar */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					Avatar
				</Text>
				<ImageUploadField image={avatar} onChange={handleAvatarChange} onError={setAvatarError} />
				{avatarError != null && (
					<InlineError message={avatarError} fieldID="profile-picture-upload-error" />
				)}
			</div>

			{/* Title */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					Title
				</Text>
				<TextField
					id="title-field"
					label="Title"
					labelHidden
					value={content.title}
					onChange={handleTitleChange}
					autoComplete="off"
					placeholder="Enter your name"
				/>
			</div>

			{/* Description */}
			<div className="space-y-1">
				<Text as="span" variant="bodySm" tone="subdued">
					Description
				</Text>
				<TextField
					id="description-field"
					label="Description"
					labelHidden
					value={content.description}
					onChange={handleDescriptionChange}
					multiline={4}
					autoComplete="off"
					placeholder="Tell us about yourself"
				/>
			</div>

			{/* Contact Links */}
			<ContactLinksSection state={state} />
		</div>
	);
};

interface TBasicAboutNodeContentMixinEditorProps {
	state: TState<TBasicAboutNodeContentMixin['value'], any>;
	editor: TPageEditor;
	className?: string;
}
