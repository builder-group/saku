import React from 'react';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { NodeEditor } from '../../../../NodeEditor';

export const CustomizeTab: React.FC<TCustomizeTabProps> = (props) => {
	const { nodeState, editor } = props;

	return <NodeEditor nodeState={nodeState} editor={editor} />;
};

interface TCustomizeTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
