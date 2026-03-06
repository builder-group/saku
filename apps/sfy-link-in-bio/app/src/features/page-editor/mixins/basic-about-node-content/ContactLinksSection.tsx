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
import { Button, Text, TextField } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { PolarisMinusIcon, PolarisPlusIcon } from '@/components';
import { contactIconMap } from '../../environment';
import { ContactLinkSelectorPopover } from './ContactLinkSelectorPopover';

export const ContactLinksSection: React.FC<TContactLinksSectionProps> = (props) => {
	const { state } = props;

	const addedContactLinks = useCompute(
		state,
		({ value }) => {
			return value.contactLinks.map((contactLink) => {
				const key = getContactKey(contactLink.action);
				const metadata = contactMetadataMap[key];

				let value = '';
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

				return { key: key as keyof typeof contactMetadataMap, value, metadata, id: contactLink.id };
			});
		},
		[]
	);

	const availableContactLinkKeys = React.useMemo(() => {
		const addedKeys = new Set(addedContactLinks.map(({ key }) => key));
		return Object.keys(contactMetadataMap).filter(
			(key) => !addedKeys.has(key as keyof typeof contactMetadataMap)
		) as Array<keyof typeof contactMetadataMap>;
	}, [addedContactLinks]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleContactAdd = React.useCallback(
		(key: keyof typeof contactMetadataMap) => {
			const metadata = contactMetadataMap[key];

			let newContactLink;
			switch (metadata.type) {
				case 'link': {
					newContactLink = {
						id: shortId(),
						action: {
							type: 'link',
							url: ''
						} as TLinkAction,
						altText: ''
					};
					break;
				}
				case 'email': {
					newContactLink = {
						id: shortId(),
						action: {
							type: 'email',
							email: '',
							url: ''
						} as TEmailAction,
						altText: ''
					};
					break;
				}
				case 'phone': {
					newContactLink = {
						id: shortId(),
						action: {
							type: 'phone',
							phone: '',
							url: ''
						} as TPhoneAction,
						altText: ''
					};
					break;
				}
				case 'social': {
					newContactLink = {
						id: shortId(),
						action: {
							type: 'social',
							provider: metadata.provider,
							handle: '',
							url: ''
						} as TSocialAction,
						altText: ''
					};
					break;
				}
			}

			if (newContactLink != null) {
				state._v.contactLinks.push(newContactLink);
				state._notify();
			}
		},
		[state]
	);

	const handleContactRemove = React.useCallback(
		(contactLinkId: string) => {
			const index = state._v.contactLinks.findIndex((link) => link.id === contactLinkId);
			if (index >= 0) {
				state._v.contactLinks.splice(index, 1);
				state._notify();
			}
		},
		[state]
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
			let trimmedValue = params.value.trim();

			const existingIndex = state._v.contactLinks.findIndex(
				({ action }) => params.key === getContactKey(action)
			);
			const existingLink = state._v.contactLinks[existingIndex];
			if (existingLink == null) {
				return;
			}

			let updatedContactLink;
			switch (params.type) {
				case 'link': {
					updatedContactLink = {
						id: existingLink.id,
						action: {
							type: 'link',
							url: contactMetadataMap.link.getUrl(trimmedValue)
						} as TLinkAction,
						altText: contactMetadataMap.link.getAltText(trimmedValue)
					};
					break;
				}
				case 'email': {
					updatedContactLink = {
						id: existingLink.id,
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
					updatedContactLink = {
						id: existingLink.id,
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
					// Keep full URLs as entered (including query params/deep links) instead of coercing to handles
					const isCustomUrl = parseUrl(trimmedValue) != null;
					updatedContactLink = {
						id: existingLink.id,
						action: {
							type: 'social',
							provider: params.provider,
							handle: trimmedValue,
							url: isCustomUrl ? trimmedValue : metadata.getUrl(trimmedValue)
						} as TSocialAction,
						altText: isCustomUrl ? trimmedValue : metadata.getAltText(trimmedValue)
					};
					break;
				}
			}

			if (updatedContactLink != null) {
				state._v.contactLinks[existingIndex] = updatedContactLink;
			}

			state._notify();
		},
		[state]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<Text as="span" variant="headingXs" tone="subdued">
					Contact Links
				</Text>
				{availableContactLinkKeys.length > 0 && (
					<ContactLinkSelectorPopover
						activator={
							<div className="flex items-center justify-center">
								<Button icon={PolarisPlusIcon} variant="plain" />
							</div>
						}
						onSelect={handleContactAdd}
						availableKeys={availableContactLinkKeys}
					/>
				)}
			</div>
			{addedContactLinks.length > 0 ? (
				addedContactLinks.map(({ key, value, metadata, id }) => {
					const IconComponent = contactIconMap[key];

					return (
						<div key={id} className="space-y-1">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1.5">
									{IconComponent != null && <IconComponent className="h-3 w-3" />}
									<Text as="span" variant="bodySm" tone="subdued">
										{metadata.label}
									</Text>
								</div>
								<Button
									icon={PolarisMinusIcon}
									onClick={() => handleContactRemove(id)}
									variant="plain"
								/>
							</div>
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
				})
			) : (
				<Text as="p" variant="bodySm" tone="subdued">
					No contact links added
				</Text>
			)}
		</div>
	);
};

interface TContactLinksSectionProps {
	state: TState<TBasicAboutNodeContentMixin['value'], any>;
}
