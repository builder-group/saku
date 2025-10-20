import { TClassicFlatPageNodeBundle, TFlatPageNode, TPageNode } from '@repo/editor';
import { Icon, Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { PolarisChevronRightIcon } from '@/components';
import { cn } from '@/lib';
import { TNodeEditorComponentProps } from '../../../lib';
import { ClassicBundleContentEditor } from '../bundles';
import { pageNodeBundleMetadata } from '../environment';
import { createPageNodeEditorContext, TPageNodeEditorContext } from '../lib';
import { ContentEditorSkeleton } from './ContentEditorSkeleton';

export const PageNodeContentEditor: React.FC<TNodeEditorComponentProps<TFlatPageNode>> = (
	props
) => {
	const { nodeState, editor, className } = props;

	const cx = React.useMemo(
		() => createPageNodeEditorContext({ node: nodeState, editor }),
		[nodeState, editor]
	);

	const bundleOptions = React.useMemo(() => {
		return pageNodeBundleMetadata.map((metadata) => ({
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
		(value: TPageNode['bundleType']) => {
			cx.switchBundleType(value).then((result) => {
				if (result.isErr()) {
					cx.shopify.toast.show('Failed to update variant type', { duration: 3000 });
				}
			});
		},
		[cx]
	);

	const handleMetadataClick = React.useCallback(() => {
		editor.switchView({ type: 'settings', view: { type: 'metadata' } });
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	const renderContentEditor = React.useCallback((): React.ReactElement | null => {
		switch (selectedBundleType) {
			case 'classic':
				return (
					<ClassicBundleContentEditor
						cx={cx as TPageNodeEditorContext<TClassicFlatPageNodeBundle>}
					/>
				);
			default:
				return null;
		}
	}, [selectedBundleType, cx]);

	return (
		<div className={cn('space-y-3 pt-3', className)}>
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
			<button
				className="flex w-full cursor-pointer items-center justify-between border-t border-neutral-200 px-4 py-3 hover:bg-neutral-50"
				onClick={handleMetadataClick}
			>
				<Text as="span" variant="headingXs" tone="subdued">
					Metadata
				</Text>
				<div>
					<Icon source={PolarisChevronRightIcon} tone="subdued" />
				</div>
			</button>
		</div>
	);
};
