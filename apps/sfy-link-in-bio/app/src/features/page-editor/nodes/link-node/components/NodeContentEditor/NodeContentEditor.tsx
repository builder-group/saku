import {
	TClassicLinkNodeBundle,
	TFeaturedLinkNodeBundle,
	TLinkNode,
	TSpotifyEmbedLinkNodeBundle,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { Select, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, JsonPreview, PortalPulse } from '@/components';
import { TNodeEditorComponentProps } from '../../../../lib';
import {
	ClassicBundleContentEditor,
	FeaturedBundleContentEditor,
	SpotifyEmbedBundleContentEditor,
	YoutubeEmbedBundleContentEditor
} from '../../bundles';
import { ContentSkeleton } from './ContentSkeleton';
import { bundleMetadataMap } from './environment';
import { createNodeEditorContext, TNodeEditorContext } from './lib';

export const LinkNodeContentEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor } = props;

	const cx = React.useMemo(
		() => createNodeEditorContext({ node: nodeState, editor }),
		[nodeState, editor]
	);

	const bundleOptions = useCompute(cx.applicableBundleTypes, ({ value }) =>
		value.map((type) => ({
			label: bundleMetadataMap[type].label,
			value: type
		}))
	);
	const isSwitchingBundle = useFeatureState(cx.isSwitchingBundle);
	const isEnhancingBundle = useFeatureState(cx.isEnhancingBundle);
	const selectedBundleType = useFeatureState(cx.selectedBundleType);

	// =========================================================================
	// Events
	// =========================================================================

	const handleBundleTypeChange = React.useCallback(
		(value: TLinkNode['bundleType']) => {
			cx.switchBundleType(value).then((result) => {
				if (result.isErr()) {
					cx.shopify.toast.show('Failed to update variant type', { duration: 3000 });
				}
			});
		},
		[cx]
	);

	// =========================================================================
	// UI
	// =========================================================================

	const renderContentEditor = React.useCallback((): React.ReactElement | null => {
		switch (selectedBundleType) {
			case 'classic':
				return <ClassicBundleContentEditor cx={cx as TNodeEditorContext<TClassicLinkNodeBundle>} />;
			case 'featured':
				return (
					<FeaturedBundleContentEditor cx={cx as TNodeEditorContext<TFeaturedLinkNodeBundle>} />
				);
			case 'youtube-embed':
				return (
					<YoutubeEmbedBundleContentEditor
						cx={cx as TNodeEditorContext<TYouTubeEmbedLinkNodeBundle>}
					/>
				);
			case 'spotify-embed':
				return (
					<SpotifyEmbedBundleContentEditor
						cx={cx as TNodeEditorContext<TSpotifyEmbedLinkNodeBundle>}
					/>
				);
			default:
				return null;
		}
	}, [selectedBundleType, cx]);

	return (
		<>
			<div className="space-y-1 border-b border-neutral-200 px-4 py-3">
				<Text as="span" variant="bodySm" tone="subdued">
					Variant
				</Text>
				<Select
					id="link-content-type-field"
					label="Variant"
					labelHidden
					options={bundleOptions}
					value={selectedBundleType}
					onChange={handleBundleTypeChange}
					disabled={isSwitchingBundle || isEnhancingBundle}
				/>
			</div>

			<div className="relative border-b border-neutral-200 py-3">
				{isSwitchingBundle ? (
					<ContentSkeleton />
				) : (
					<>
						<PortalPulse isActive={cx.isEnhancingBundle} className="top-0 left-0" />
						{renderContentEditor()}
					</>
				)}
			</div>

			{/* Debug Section */}
			{editor.isDebug() && (
				<AccordionSection title="Debug" collapsibleClassName="px-0 space-y-3">
					<div className="space-y-1 px-4">
						<Text as="span" variant="bodySm" tone="subdued">
							JSON
						</Text>
						<JsonPreview data={nodeState._v} />
					</div>
				</AccordionSection>
			)}
		</>
	);
};
