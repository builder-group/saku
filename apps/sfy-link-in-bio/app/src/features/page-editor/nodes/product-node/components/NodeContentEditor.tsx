import { TClassicProductNodeBundle, TProductNode } from '@repo/editor';
import { Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { AccordionSection, JsonPreview } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';
import { ClassicBundleContentEditor } from '../bundles';
import { productNodeBundleMetadata } from '../environment';
import { createProductNodeEditorContext, TProductNodeEditorContext } from '../lib';
import { ContentSkeleton } from './ContentSkeleton';

export const ProductNodeContentEditor: React.FC<TNodeEditorComponentProps<TProductNode>> = (
	props
) => {
	const { nodeState, editor } = props;

	const cx = React.useMemo(
		() => createProductNodeEditorContext({ node: nodeState, editor }),
		[nodeState, editor]
	);

	const bundleOptions = React.useMemo(() => {
		return productNodeBundleMetadata.map((metadata) => ({
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
		(value: TProductNode['bundleType']) => {
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
					<ClassicBundleContentEditor
						cx={cx as TProductNodeEditorContext<TClassicProductNodeBundle>}
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
					disabled={isSwitchingBundle}
				/>
			</div>

			<div className="relative border-b border-neutral-200 py-3">
				{isSwitchingBundle ? <ContentSkeleton /> : renderContentEditor()}
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
