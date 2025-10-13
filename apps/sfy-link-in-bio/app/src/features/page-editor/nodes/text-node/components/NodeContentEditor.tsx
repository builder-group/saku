import { TTextNode } from '@repo/editor';
import { Text } from '@shopify/polaris';
import React from 'react';
import { AccordionSection, JsonPreview } from '@/components';
import { useNodeProperty } from '../../../hooks';
import { TNodeEditorComponentProps } from '../../../lib';
import { RichTextNodeContentMixinEditor } from '../../../mixins';

export const TextNodeContentEditor: React.FC<TNodeEditorComponentProps<TTextNode>> = (props) => {
	const { nodeState, editor } = props;

	const contentState = useNodeProperty(nodeState, 'content');

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<>
			<RichTextNodeContentMixinEditor state={contentState} editor={editor} />

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
