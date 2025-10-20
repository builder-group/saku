import { Text } from '@shopify/polaris';
import React from 'react';
import { AccordionSection, JsonPreview } from '@/components';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { NodeContentEditor } from '../../../../node';

export const ContentTab: React.FC<TContentTabProps> = (props) => {
	const { nodeState, editor } = props;

	return (
		<>
			<NodeContentEditor
				nodeState={nodeState}
				editor={editor}
				className="border-b border-neutral-200"
			/>
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

interface TContentTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
