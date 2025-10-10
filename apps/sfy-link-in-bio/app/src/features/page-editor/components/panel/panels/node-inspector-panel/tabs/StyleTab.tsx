import React from 'react';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { NodeStyleEditor } from '../../../../node';

export const StyleTab: React.FC<TStyleTabProps> = (props) => {
	const { nodeState, editor } = props;

	return <NodeStyleEditor nodeState={nodeState} editor={editor} />;
};

interface TStyleTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
