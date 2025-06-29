import { shortId } from '@blgc/utils';
import { Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, type TImageUploadOnChangeImage } from '@/components';
import { generateSocialUrl, socialMetadataMap, TSocialMetadata } from '../../../environment';
import { TAboutNode, TSocialLink } from '../../../types';
import { SelectStyleField, TextStyleField, ToggleStyleField } from '../fields';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const AboutNodeEditor: React.FC<TNodeEditorComponentProps<TAboutNode>> = (props) => {
	const { nodeState, editor } = props;
	const node = useFeatureState(nodeState);

	const parentNodeState = React.useMemo(() => editor.getRootNode(), [editor]);

	// =========================================================================
	// Computed Values
	// =========================================================================

	const socialHandles = React.useMemo(() => {
		const handles: Record<TSocialLink['provider'], string> = Object.keys(socialMetadataMap).reduce(
			(acc, provider) => {
				acc[provider as TSocialLink['provider']] = '';
				return acc;
			},
			{} as Record<TSocialLink['provider'], string>
		);

		node.socialLinks?.forEach((link) => {
			handles[link.provider] = link.handle;
		});

		return handles;
	}, [node.socialLinks]);

	// =========================================================================
	// Events
	// =========================================================================

	const handleNameChange = React.useCallback(
		(value: string) => {
			nodeState.set((prev) => ({ ...prev, name: value }));
		},
		[nodeState]
	);

	const handleBioChange = React.useCallback(
		(value: string) => {
			if (value === '') {
				nodeState.set((prev) => ({ ...prev, bio: undefined }));
			} else {
				nodeState.set((prev) => ({ ...prev, bio: value }));
			}
		},
		[nodeState]
	);

	const handleMediaChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			nodeState.set((prev) => ({
				...prev,
				media: {
					type: 'image',
					url: image.url,
					fileName: image.fileName
				}
			}));
		},
		[nodeState]
	);

	const handleSocialHandleChange = React.useCallback(
		(provider: TSocialLink['provider'], handle: string) => {
			nodeState.set((prev) => {
				const currentLinks = prev.socialLinks ?? [];

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
					socialLinks: filteredLinks.length > 0 ? filteredLinks : undefined
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
					{/* Name */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Name
						</Text>
						<TextField
							id="name-field"
							label="Name"
							labelHidden
							value={node.name}
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
							value={node.bio ?? ''}
							onChange={handleBioChange}
							multiline={4}
							autoComplete="off"
							placeholder="Tell us about yourself"
						/>
					</div>

					{/* Avatar/Media */}
					<div className="space-y-1">
						<Text as="span" variant="bodySm" tone="subdued">
							Avatar
						</Text>
						<ImageUploadField image={node.media} onChange={handleMediaChange} />
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

			{/* Style Section */}
			<AccordionSection title="Style" defaultOpen={true}>
				<div className="space-y-3">
					<div className="grid grid-cols-2 gap-3">
						<TextStyleField
							label="Padding"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.padding}
							nodeValueSetter={(node, value) => {
								node._v.style.padding = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.padding}
							type="number"
							autoComplete="off"
						/>

						<TextStyleField
							label="Margin"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.margin}
							nodeValueSetter={(node, value) => {
								node._v.style.margin = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.margin}
							type="number"
							autoComplete="off"
						/>
					</div>

					<TextStyleField
						label="Background Color"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.backgroundColor}
						nodeValueSetter={(node, value) => {
							node._v.style.backgroundColor = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.backgroundColor}
						autoComplete="off"
					/>

					<TextStyleField
						label="Font Family"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.fontFamily}
						nodeValueSetter={(node, value) => {
							node._v.style.fontFamily = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.fontFamily}
						autoComplete="off"
					/>

					<div className="grid grid-cols-2 gap-3">
						<TextStyleField
							label="Font Size"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.fontSize}
							nodeValueSetter={(node, value) => {
								node._v.style.fontSize = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.fontSize}
							type="number"
							autoComplete="off"
						/>

						<TextStyleField
							label="Text Color"
							node={nodeState}
							parentNode={parentNodeState}
							nodeValueMapper={(value) => value.style.textColor}
							nodeValueSetter={(node, value) => {
								node._v.style.textColor = value;
								node._notify();
							}}
							parentValueMapper={(parent) => parent.style.children?.textColor}
							autoComplete="off"
						/>
					</div>

					<SelectStyleField
						label="Text Align"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.textAlign}
						nodeValueSetter={(node, value) => {
							node._v.style.textAlign = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.textAlign}
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' }
						]}
					/>

					<TextStyleField
						label="Border Radius"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.borderRadius}
						nodeValueSetter={(node, value) => {
							node._v.style.borderRadius = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.borderRadius}
						type="number"
						autoComplete="off"
					/>

					<ToggleStyleField
						label="Shadow"
						node={nodeState}
						parentNode={parentNodeState}
						nodeValueMapper={(value) => value.style.shadow}
						nodeValueSetter={(node, value) => {
							node._v.style.shadow = value;
							node._notify();
						}}
						parentValueMapper={(parent) => parent.style.children?.shadow}
						ariaLabel="Enable shadow"
					/>
				</div>
			</AccordionSection>
		</>
	);
};
