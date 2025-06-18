import { Text, TextField } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, ImageUploadField, type TImageUploadOnChangeImage } from '@/components';
import { TAboutBlock } from '../../../environment';
import { TBlockEditorComponentProps } from '../blockEditorsRegistry';

export const AboutBlockEditor: React.FC<TBlockEditorComponentProps<TAboutBlock>> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);

	// =========================================================================
	// Events
	// =========================================================================

	const handleNameChange = React.useCallback(
		(value: string) => {
			blockState.set((prev) => ({ ...prev, name: value }));
		},
		[blockState]
	);

	const handleBioChange = React.useCallback(
		(value: string) => {
			if (value === '') {
				blockState.set((prev) => ({ ...prev, bio: undefined }));
			} else {
				blockState.set((prev) => ({ ...prev, bio: value }));
			}
		},
		[blockState]
	);

	const handleAvatarChange = React.useCallback(
		(image: TImageUploadOnChangeImage) => {
			blockState.set((prev) => ({
				...prev,
				avatarUrl: image.url
			}));
		},
		[blockState]
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
							value={block.name}
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
							value={block.bio ?? ''}
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
							image={block.avatarUrl ? { url: block.avatarUrl, fileName: 'Avatar' } : undefined}
							onChange={handleAvatarChange}
						/>
					</div>
				</div>
			</AccordionSection>
		</>
	);
};
