import { shortId } from '@blgc/utils';
import {
	contactMetadataMap,
	getContactKey,
	parseUrl,
	TAboutNode,
	TEmailAction,
	TPhoneAction,
	TSocialAction
} from '@repo/editor';
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

	const contactValues = React.useMemo(() => {
		return Object.entries(contactMetadataMap).map(([key, metadata]) => {
			const contactIcon = content.contactIcons?.find(({ action }) => key === getContactKey(action));

			// Extract value from icon
			let value = '';
			if (contactIcon != null) {
				switch (contactIcon.action.type) {
					case 'email':
						value = contactIcon.action.email;
						break;
					case 'phone':
						value = contactIcon.action.phone;
						break;
					case 'social':
						value = contactIcon.action.handle;
						break;
				}
			}

			return { key: key as keyof typeof contactMetadataMap, value, metadata };
		});
	}, [content.contactIcons]);

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

	const handleContactChange = React.useCallback(
		(
			params:
				| { type: 'email'; key: keyof typeof contactMetadataMap; value: string }
				| { type: 'phone'; key: keyof typeof contactMetadataMap; value: string }
				| {
						type: 'social';
						key: keyof typeof contactMetadataMap;
						value: string;
						provider: TSocialAction['provider'];
				  }
		) => {
			const currentIcons = [...(nodeState._v.content.contactIcons ?? [])];
			let trimmedValue = params.value.trim();

			// Auto-detect and parse URLs for social platforms
			if (params.type === 'social' && parseUrl(trimmedValue) != null) {
				const extractedHandle =
					contactMetadataMap[`social.${params.provider}`].getHandle(trimmedValue);
				if (extractedHandle != null && extractedHandle !== trimmedValue) {
					trimmedValue = extractedHandle;
				}
			}

			const existingIndex = currentIcons.findIndex(
				({ action }) => params.key === getContactKey(action)
			);

			// Create new icon
			if (trimmedValue !== '') {
				let newIcon;
				switch (params.type) {
					case 'email': {
						newIcon = {
							id: shortId(),
							action: {
								type: 'email',
								email: trimmedValue,
								url: contactMetadataMap.email.getUrl(trimmedValue)
							} as TEmailAction,
							title: contactMetadataMap.email.getTitle(trimmedValue)
						};
						break;
					}
					case 'phone': {
						newIcon = {
							id: shortId(),
							action: {
								type: 'phone',
								phone: trimmedValue,
								url: contactMetadataMap.phone.getUrl(trimmedValue)
							} as TPhoneAction,
							title: contactMetadataMap.phone.getTitle(trimmedValue)
						};
						break;
					}
					case 'social': {
						const metadata = contactMetadataMap[`social.${params.provider}`];
						newIcon = {
							id: shortId(),
							action: {
								type: 'social',
								provider: params.provider,
								handle: trimmedValue,
								url: metadata.getUrl(trimmedValue)
							} as TSocialAction,
							title: metadata.getTitle(trimmedValue)
						};
						break;
					}
				}

				if (newIcon != null) {
					// Update existing icon
					if (existingIndex >= 0) {
						currentIcons[existingIndex] = newIcon;
					}
					// Add new icon
					else {
						currentIcons.push(newIcon);
					}
				}
			}
			// Remove icon if value is empty
			else if (existingIndex >= 0) {
				currentIcons.splice(existingIndex, 1);
			}

			nodeState._v.content.contactIcons = currentIcons;
			nodeState._notify();
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

			{/* Contact Section */}
			<AccordionSection title="Contact" defaultOpen={false}>
				<div className="space-y-3">
					{contactValues.map(({ key, value, metadata }) => {
						return (
							<div key={key} className="space-y-1">
								<Text as="span" variant="bodySm" tone="subdued">
									{metadata.label}
								</Text>
								<TextField
									id={`${key}-field`}
									label={metadata.label}
									labelHidden
									value={value}
									onChange={(newValue) => {
										switch (metadata.type) {
											case 'social':
												handleContactChange({
													type: 'social',
													key,
													value: newValue,
													provider: metadata.provider
												});
												break;
											default:
												handleContactChange({ type: metadata.type, key, value: newValue });
										}
									}}
									autoComplete="off"
									placeholder={metadata.placeholder}
								/>
							</div>
						);
					})}
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
						mapValue={(value) => value.textXl}
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
