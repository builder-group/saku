import React from 'react';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { NodeContentEditor } from '../../../../node';

export const ContentTab: React.FC<TContentTabProps> = (props) => {
	const { nodeState, editor } = props;

	return (
		<div className="pt-3">
			<NodeContentEditor nodeState={nodeState} editor={editor} />
		</div>
	);
};

interface TContentTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
