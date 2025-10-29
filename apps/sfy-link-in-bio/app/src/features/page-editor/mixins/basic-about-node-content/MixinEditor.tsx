import { shortId } from '@blgc/utils';
import {
	contactMetadataMap,
	getContactKey,
	parseUrl,
	TBasicAboutNodeContentMixin,
	TEmailAction,
	TLinkAction,
	TPhoneAction,
	TSocialAction
} from '@repo/editor';
import { InlineError, Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { ImageUploadField, TImageUploadEvent } from '@/components';
import { cn } from '@/lib';
import { TPageEditor } from '../../lib';

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

	const contactLinks = React.useMemo(() => {
		return Object.entries(contactMetadataMap).map(([key, metadata]) => {
			const contactLink = content.contactLinks?.find(({ action }) => key === getContactKey(action));

			// Extract value from contact link
			let value = '';
			if (contactLink != null) {
				switch (contactLink.action.type) {
					case 'link':
						value = contactLink.action.url;
						break;
					case 'email':
						value = contactLink.action.email;
						break;
					case 'phone':
						value = contactLink.action.phone;
						break;
					case 'social':
						value = contactLink.action.handle;
						break;
				}
			}

			return { key: key as keyof typeof contactMetadataMap, value, metadata };
		});
	}, [content.contactLinks]);

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

	const handleContactChange = React.useCallback(
		(
			params:
				| { type: 'link'; key: keyof typeof contactMetadataMap; value: string }
				| { type: 'email'; key: keyof typeof contactMetadataMap; value: string }
				| { type: 'phone'; key: keyof typeof contactMetadataMap; value: string }
				| {
						type: 'social';
						key: keyof typeof contactMetadataMap;
						value: string;
						provider: TSocialAction['provider'];
				  }
		) => {
			const contactLinks = [...(state._v.contactLinks ?? [])];
			let trimmedValue = params.value.trim();

			// Auto-detect and parse URLs for social platforms
			if (params.type === 'social' && parseUrl(trimmedValue) != null) {
				const handle = contactMetadataMap[`social.${params.provider}`].getHandle(trimmedValue);
				if (handle != null && handle !== trimmedValue) {
					trimmedValue = handle;
				}
			}

			const existingIndex = contactLinks.findIndex(
				({ action }) => params.key === getContactKey(action)
			);

			// Create new contact link
			if (trimmedValue.length > 0) {
				let newContactLink;
				switch (params.type) {
					case 'link': {
						newContactLink = {
							id: shortId(),
							action: {
								type: 'link',
								url: contactMetadataMap.link.getUrl(trimmedValue)
							} as TLinkAction,
							altText: contactMetadataMap.link.getAltText(trimmedValue)
						};
						break;
					}
					case 'email': {
						newContactLink = {
							id: shortId(),
							action: {
								type: 'email',
								email: trimmedValue,
								url: contactMetadataMap.email.getUrl(trimmedValue)
							} as TEmailAction,
							altText: contactMetadataMap.email.getAltText(trimmedValue)
						};
						break;
					}
					case 'phone': {
						newContactLink = {
							id: shortId(),
							action: {
								type: 'phone',
								phone: trimmedValue,
								url: contactMetadataMap.phone.getUrl(trimmedValue)
							} as TPhoneAction,
							altText: contactMetadataMap.phone.getAltText(trimmedValue)
						};
						break;
					}
					case 'social': {
						const metadata = contactMetadataMap[`social.${params.provider}`];
						newContactLink = {
							id: shortId(),
							action: {
								type: 'social',
								provider: params.provider,
								handle: trimmedValue,
								url: metadata.getUrl(trimmedValue)
							} as TSocialAction,
							altText: metadata.getAltText(trimmedValue)
						};
						break;
					}
				}

				if (newContactLink != null) {
					// Update existing icon
					if (existingIndex >= 0) {
						contactLinks[existingIndex] = newContactLink;
					}
					// Add new icon
					else {
						contactLinks.push(newContactLink);
					}
				}
			}
			// Remove contact link if value is empty
			else if (existingIndex >= 0) {
				contactLinks.splice(existingIndex, 1);
			}

			state._v.contactLinks = contactLinks;
			state._notify();
		},
		[state]
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
			<div>
				<Text as="span" variant="headingXs" tone="subdued">
					Contact Links
				</Text>
			</div>
			<div className="space-y-3">
				{contactLinks.map(({ key, value, metadata }) => {
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
		</div>
	);
};

interface TBasicAboutNodeContentMixinEditorProps {
	state: TState<TBasicAboutNodeContentMixin['value'], any>;
	editor: TPageEditor;
	className?: string;
}
