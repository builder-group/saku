import { Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
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
			{editor.isDebug() && <DebugSection nodeState={nodeState} />}
		</>
	);
};

interface TContentTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}

const DebugSection: React.FC<TDebugSectionProps> = (props) => {
	const { nodeState } = props;
	const value = useFeatureState(nodeState);

	return (
		<AccordionSection title="Debug" collapsibleClassName="px-0 space-y-3">
			<div className="space-y-1 px-4">
				<Text as="span" variant="bodySm" tone="subdued">
					JSON
				</Text>
				<JsonPreview data={value} />
			</div>
		</AccordionSection>
	);
};

interface TDebugSectionProps {
	nodeState: TNodeState;
}
