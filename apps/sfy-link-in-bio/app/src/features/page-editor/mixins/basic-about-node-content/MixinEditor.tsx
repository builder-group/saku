import { shortId } from '@blgc/utils';
import {
	contactMetadataMap,
	getContactKey,
	parseUrl,
	TBasicAboutNodeContentMixin,
	TEmailAction,
	TPhoneAction,
	TSocialAction
} from '@repo/editor';
import { InlineError, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { AccordionSection, ImageUploadField, TImageUploadEvent } from '@/components';
import { TPageEditor } from '../../lib';

export const BasicAboutNodeContentMixinEditor = (props: TBasicAboutNodeContentMixinEditorProps) => {
	const { state, editor } = props;

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
			state._v.name = value;
			state._notify();
		},
		[state]
	);

	const handleBioChange = React.useCallback(
		(value: string) => {
			if (!value.length) {
				state._v.bio = undefined;
			} else {
				state._v.bio = value;
			}
			state._notify();
		},
		[state]
	);

	const handleAvatarChange = React.useCallback(
		(event: TImageUploadEvent) => {
			switch (event.type) {
				case 'Changed': {
					const hash = editor.registerImage(event.url, event.fileName);
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
			const currentIcons = [...(state._v.contactIcons ?? [])];
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

			state._v.contactIcons = currentIcons;
			state._notify();
		},
		[state]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<div className="space-y-4 border-b border-neutral-200 px-4 py-3">
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
		</>
	);
};

interface TBasicAboutNodeContentMixinEditorProps {
	state: TState<TBasicAboutNodeContentMixin['value'], any>;
	editor: TPageEditor;
}
