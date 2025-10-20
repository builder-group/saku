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
import { PortalPulse } from '@/components';
import { cn } from '@/lib';
import { TNodeEditorComponentProps } from '../../../lib';
import {
	ClassicBundleContentEditor,
	FeaturedBundleContentEditor,
	SpotifyEmbedBundleContentEditor,
	YoutubeEmbedBundleContentEditor
} from '../bundles';
import { linkNodeBundleMetadataMap } from '../environment';
import { createLinkNodeEditorContext, TLinkNodeEditorContext } from '../lib';
import { ContentEditorSkeleton } from './ContentEditorSkeleton';

export const LinkNodeContentEditor: React.FC<TNodeEditorComponentProps<TLinkNode>> = (props) => {
	const { nodeState, editor, className } = props;

	const cx = React.useMemo(
		() => createLinkNodeEditorContext({ node: nodeState, editor }),
		[nodeState, editor]
	);

	const bundleOptions = useCompute(cx.applicableBundleTypes, ({ value }) =>
		value.map((type) => ({
			label: linkNodeBundleMetadataMap[type].label,
			value: type
		}))
	);
	const isSwitchingBundle = useFeatureState(cx.isSwitchingBundle);
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
				return (
					<ClassicBundleContentEditor cx={cx as TLinkNodeEditorContext<TClassicLinkNodeBundle>} />
				);
			case 'featured':
				return (
					<FeaturedBundleContentEditor cx={cx as TLinkNodeEditorContext<TFeaturedLinkNodeBundle>} />
				);
			case 'youtube-embed':
				return (
					<YoutubeEmbedBundleContentEditor
						cx={cx as TLinkNodeEditorContext<TYouTubeEmbedLinkNodeBundle>}
					/>
				);
			case 'spotify-embed':
				return (
					<SpotifyEmbedBundleContentEditor
						cx={cx as TLinkNodeEditorContext<TSpotifyEmbedLinkNodeBundle>}
					/>
				);
			default:
				return null;
		}
	}, [selectedBundleType, cx]);

	return (
		<div className={cn('space-y-3 py-3', className)}>
			<div className="space-y-1 px-4">
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
					disabled={isSwitchingBundle}
				/>
			</div>
			<div className="h-px bg-neutral-200" />
			<div className="relative">
				{isSwitchingBundle ? (
					<ContentEditorSkeleton />
				) : (
					<>
						<PortalPulse isActive={cx.isEnhancingBundle} className="-top-3 -bottom-3 left-0" />
						{renderContentEditor()}
					</>
				)}
			</div>
		</div>
	);
};
