import { Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, type TImageUploadOnChangeImage } from '@/components';
import { TAboutNode } from '../../../types';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const AboutNodeEditor: React.FC<TNodeEditorComponentProps<TAboutNode>> = (props) => {
	const { nodeState } = props;
	const node = useFeatureState(nodeState);

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

	const handleAvatarChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			nodeState.set((prev) => ({
				...prev,
				avatarUrl: image.url
			}));
		},
		[nodeState]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<AccordionSection title="Content">
				<div className="space-y-4">
					{/* Name */}
					<div className="space-y-1">
						<div>
							<Text as="span" variant="bodySm" tone="subdued">
								Name
							</Text>
						</div>
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
						<div>
							<Text as="span" variant="bodySm" tone="subdued">
								Bio
							</Text>
						</div>
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

					{/* Avatar */}
					<div className="space-y-1">
						<div>
							<Text as="span" variant="bodySm" tone="subdued">
								Avatar
							</Text>
						</div>
						<ImageUploadField
							image={node.avatarUrl ? { url: node.avatarUrl, fileName: 'Avatar' } : undefined}
							onChange={handleAvatarChange}
						/>
					</div>
				</div>
			</AccordionSection>
		</>
	);
};
