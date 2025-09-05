import { shortId } from '@blgc/utils';
import { TAboutNode, TSocialLink } from '@repo/editor';
import { InlineError, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, type TImageUploadEvent } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	AppearanceStyleMixinEditor,
	AutoLayoutStyleMixinEditor,
	FillStyleMixinEditor,
	ImageStyleMixinEditor,
	ShadowStyleMixinEditor,
	StrokeStyleMixinEditor,
	TextStyleMixinEditor
} from '../../../mixins';
import { generateSocialUrl, socialMetadataMap, TSocialMetadata } from '../social-metadata';

export const AboutNodeEditor: React.FC<TNodeEditorComponentProps<TAboutNode>> = (props) => {
	const { nodeState, editor } = props;
	const { content } = useFeatureState(nodeState);

	const [profilePictureImageError, setProfilePictureImageError] = React.useState<string | null>(
		null
	);
	const profilePictureImage = React.useMemo(() => {
		const asset = editor.getImageAsset(content.profilePicture);
		if (asset == null || asset.storage.type !== 'url') {
			return undefined;
		}

		return {
			url: asset.storage.url,
			fileName: asset.fileName
		};
	}, [content.profilePicture, editor]);

	const socialHandles = React.useMemo(() => {
		const handles: Record<TSocialLink['provider'], string> = Object.keys(socialMetadataMap).reduce(
			(acc, provider) => {
				acc[provider as TSocialLink['provider']] = '';
				return acc;
			},
			{} as Record<TSocialLink['provider'], string>
		);

		content.socialLinks?.forEach((link) => {
			handles[link.provider] = link.handle;
		});

		return handles;
	}, [content.socialLinks]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleNameChange = React.useCallback(
		(value: string) => {
			nodeState._v.content.name = value;
			nodeState._notify();
		},
		[nodeState]
	);

	const handleBioChange = React.useCallback(
		(value: string) => {
			if (!value.length) {
				nodeState._v.content.bio = undefined;
			} else {
				nodeState._v.content.bio = value;
			}
			nodeState._notify();
		},
		[nodeState]
	);

	const handleProfilePictureChange = React.useCallback(
		(event: TImageUploadEvent) => {
			switch (event.type) {
				case 'Changed': {
					const hash = editor.registerImage(event.url, event.fileName);
					if (hash != null) {
						nodeState._v.content.profilePicture = hash;
						nodeState._notify();
					}
					break;
				}
				case 'Removed': {
					nodeState._v.content.profilePicture = undefined;
					nodeState._notify();
					break;
				}
			}
		},
		[nodeState, editor]
	);

	const handleSocialHandleChange = React.useCallback(
		(provider: TSocialLink['provider'], handle: string) => {
			nodeState.set((prev) => {
				const currentLinks = prev.content.socialLinks ?? [];

				// Remove existing link for this provider
				const filteredLinks = currentLinks.filter((link) => link.provider !== provider);

				// Add new link if handle is not empty
				if (handle.trim() !== '') {
					const newLink: TSocialLink = {
						id: shortId(),
						provider,
						handle: handle.trim(),
						url: generateSocialUrl(provider, handle.trim())
					};
					filteredLinks.push(newLink);
				}

				return {
					...prev,
					content: {
						...prev.content,
						socialLinks: filteredLinks
					}
				};
			});
		},
		[nodeState]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true}>
				<div className="space-y-4">
					{/* Avatar */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Avatar
						</Text>
						<ImageUploadField
							image={profilePictureImage}
							onChange={handleProfilePictureChange}
							onError={setProfilePictureImageError}
						/>
						{profilePictureImageError != null && (
							<InlineError
								message={profilePictureImageError}
								fieldID="profile-picture-upload-error"
							/>
						)}
					</div>

					{/* Name */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Name
						</Text>
						<TextField
							id="name-field"
							label="Name"
							labelHidden
							value={content.name}
							onChange={handleNameChange}
							autoComplete="off"
							placeholder="Enter your name"
						/>
					</div>

					{/* Bio */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Bio
						</Text>
						<TextField
							id="bio-field"
							label="Bio"
							labelHidden
							value={content.bio}
							onChange={handleBioChange}
							multiline={4}
							autoComplete="off"
							placeholder="Tell us about yourself"
						/>
					</div>
				</div>
			</AccordionSection>

			{/* Socials Section */}
			<AccordionSection title="Socials" defaultOpen={false}>
				<div className="space-y-3">
					{(Object.entries(socialMetadataMap) as [TSocialLink['provider'], TSocialMetadata][]).map(
						([provider, metadata]) => {
							return (
								<div key={provider} className="space-y-1">
									<Text as="span" variant="bodySm" tone="subdued">
										{metadata.label}
									</Text>
									<TextField
										id={`social-${provider}-field`}
										label={metadata.label}
										labelHidden
										value={socialHandles[provider]}
										onChange={(value) => handleSocialHandleChange(provider, value)}
										autoComplete="off"
										placeholder={metadata.placeholder}
									/>
								</div>
							);
						}
					)}
				</div>
			</AccordionSection>

			{/* Design Section */}
			<AccordionSection title="Design" collapsibleClassName="p-0 border-b-0">
				<AccordionSection
					title="Layer"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<AutoLayoutStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.autoLayout}
						tokenSet={editor.mixinTokenMap.autoLayout}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<AppearanceStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.appearance}
						tokenSet={editor.mixinTokenMap.appearance}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<FillStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.fill}
						applyValue={(state, value) => {
							state._v.fill = value;
						}}
						tokenSet={editor.mixinTokenMap.fill}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<StrokeStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.stroke}
						applyValue={(state, value) => {
							state._v.stroke = value;
						}}
						tokenSet={editor.mixinTokenMap.stroke}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
					<div className="h-px bg-neutral-200" />
					<ShadowStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.shadow}
						applyValue={(state, value) => {
							state._v.shadow = value;
						}}
						tokenSet={editor.mixinTokenMap.shadow}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
				</AccordionSection>
				<AccordionSection
					title="Name Text"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<TextStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.xlText}
						tokenSet={editor.mixinTokenMap.text}
						tokenRefKey={'xl'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
				</AccordionSection>
				<AccordionSection
					title="Bio Text"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<TextStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.text}
						tokenSet={editor.mixinTokenMap.text}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
				</AccordionSection>
				<AccordionSection
					title="Avatar Image"
					collapsibleClassName="px-0 space-y-3"
					size="tight"
					defaultOpen={true}
				>
					<ImageStyleMixinEditor
						state={nodeState}
						mapValue={(value) => value.image}
						tokenSet={editor.mixinTokenMap.image}
						tokenRefKey={'default'}
						mapToToken={(tokenRef, tokenSet) => tokenSet?.[tokenRef]?.value}
						editor={editor}
					/>
				</AccordionSection>
			</AccordionSection>
		</>
	);
};
