import {
	TClassicLinkNodeBundle,
	TFeaturedLinkNodeBundle,
	TLinkNode,
	TSpotifyEmbedLinkNodeBundle,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Select, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection, JsonPreview, PortalPulse } from '@/components';
import { TNodeEditorComponentProps } from '../../../../lib';
import { ClassicContentEditor } from './ClassicContentEditor';
import { ContentSkeleton } from './ContentSkeleton';
import { bundleMetadataMap } from './environment';
import { FeaturedContentEditor } from './FeaturedContentEditor';
import { createNodeEditorContext, TNodeEditorContext } from './lib';
import { SpotifyEmbedContentEditor } from './SpotifyEmbedContentEditor';
import { YoutubeEmbedContentEditor } from './YoutubeEmbedContentEditor';

export const LinkNodeContentEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor } = props;
	const shopify = useAppBridge();

	const cx = React.useMemo(
		() => createNodeEditorContext({ node: nodeState, editor }),
		[nodeState, editor]
	);

	const bundleType = useCompute(cx.node, ({ value }) => value.bundleType);
	const applicableBundleOptions = useCompute(cx.applicableBundleTypes, ({ value }) =>
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
					shopify.toast.show('Failed to update variant type', { duration: 3000 });
				}
			});
		},
		[cx, shopify]
	);

	// =========================================================================
	// UI
	// =========================================================================

	const renderEditor = React.useCallback((): React.ReactElement | null => {
		switch (bundleType) {
			case 'classic':
				return (
					<ClassicContentEditor
						cx={cx as TNodeEditorContext<TClassicLinkNodeBundle>}
						className="z-10"
					/>
				);
			case 'featured':
				return (
					<FeaturedContentEditor
						cx={cx as TNodeEditorContext<TFeaturedLinkNodeBundle>}
						className="z-10"
					/>
				);
			case 'youtube-embed':
				return (
					<YoutubeEmbedContentEditor
						cx={cx as TNodeEditorContext<TYouTubeEmbedLinkNodeBundle>}
						className="z-10"
					/>
				);
			case 'spotify-embed':
				return (
					<SpotifyEmbedContentEditor
						cx={cx as TNodeEditorContext<TSpotifyEmbedLinkNodeBundle>}
						className="z-10"
					/>
				);
			default:
				return null;
		}
	}, [bundleType, cx]);

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
					options={applicableBundleOptions}
					value={selectedBundleType}
					onChange={handleBundleTypeChange}
					disabled={isSwitchingBundle || isEnhancingBundle}
				/>
			</div>

			<div className="relative border-b border-neutral-200">
				{isSwitchingBundle ? (
					<ContentSkeleton className="z-10" />
				) : (
					<>
						<PortalPulse isActive={cx.isEnhancingBundle} className="top-0 left-0" />
						{renderEditor()}
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
