import { TRichTextNodeBundle, TSectionTitleTextNodeBundle, TTextNode } from '@repo/editor';
import { Select, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { AccordionSection, JsonPreview } from '@/components';
import { TNodeEditorComponentProps } from '../../../lib';
import { RichBundleContentEditor, SectionTitleBundleContentEditor } from '../bundles';
import { textNodeBundleMetadata } from '../environment';
import { createTextNodeEditorContext, TTextNodeEditorContext } from '../lib';
import { ContentEditorSkeleton } from './ContentEditorSkeleton';

export const TextNodeContentEditor: React.FC<TNodeEditorComponentProps<TTextNode>> = (props) => {
	const { nodeState, editor } = props;

	const cx = React.useMemo(
		() => createTextNodeEditorContext({ node: nodeState, editor }),
		[nodeState, editor]
	);

	const bundleOptions = React.useMemo(() => {
		return textNodeBundleMetadata.map((metadata) => ({
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
		(value: TTextNode['bundleType']) => {
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
			case 'rich':
				return <RichBundleContentEditor cx={cx as TTextNodeEditorContext<TRichTextNodeBundle>} />;
			case 'section-title':
				return (
					<SectionTitleBundleContentEditor
						cx={cx as TTextNodeEditorContext<TSectionTitleTextNodeBundle>}
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
				{isSwitchingBundle ? <ContentEditorSkeleton /> : renderContentEditor()}
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
