import { TProductNode } from '@repo/editor';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { AccordionSection } from '@/components';
import { TNodeEditorComponentProps } from '../nodeEditorRegistry';

export const ProductNodeEditor: React.FC<TNodeEditorComponentProps<TProductNode>> = (props) => {
	const { nodeState, editor } = props;
	const node = useFeatureState(nodeState);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			{/* Content Section */}
			<AccordionSection title="Content" defaultOpen={true}>
				Content
				<button
					onClick={async () => {
						const product = await editor.shopify.resourcePicker({ type: 'product' });
						console.log({ product });
					}}
				>
					Add Product
				</button>
			</AccordionSection>

			{/* Style Section */}
			<AccordionSection title="Style" defaultOpen={true} collapsibleClassName="px-0 space-y-3">
				Style
			</AccordionSection>
		</>
	);
};
