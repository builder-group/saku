import { TClassicMediaNodeBundle, TMediaNode } from '@repo/editor';
import { Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { cn } from '@/lib';
import { TNodeEditorComponentProps } from '../../../lib';
import { ClassicBundleContentEditor } from '../bundles';
import { mediaNodeBundleMetadata } from '../environment';
import { createMediaNodeEditorContext, TMediaNodeEditorContext } from '../lib';
import { ContentEditorSkeleton } from './ContentEditorSkeleton';

export const MediaNodeContentEditor: React.FC<TNodeEditorComponentProps<TMediaNode>> = (props) => {
	const { nodeState, editor, className } = props;

	const cx = React.useMemo(
		() => createMediaNodeEditorContext({ node: nodeState, editor }),
		[nodeState, editor]
	);

	const bundleOptions = React.useMemo(() => {
		return mediaNodeBundleMetadata.map((metadata) => ({
			label: metadata.label,
			value: metadata.type
		}));
	}, []);
	const isSwitchingBundle = useFeatureState(cx.isSwitchingBundle);
	const selectedBundleType = useFeatureState(cx.selectedBundleType);

	// =========================================================================
	// Events
	// =========================================================================

	const handleBundleTypeChange = React.useCallback(
		(value: TMediaNode['bundleType']) => {
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
					<ClassicBundleContentEditor cx={cx as TMediaNodeEditorContext<TClassicMediaNodeBundle>} />
				);
			default:
				return null;
		}
	}, [selectedBundleType, cx]);

	return (
		<div className={cn('space-y-3', className)}>
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
			{isSwitchingBundle ? <ContentEditorSkeleton /> : renderContentEditor()}
		</div>
	);
};
