import { TFlatNode } from '@repo/editor';
import React from 'react';
import { NodeEditor, TNodeState } from '../../../features/node';
import { TPageEditor } from '../../../lib';

export const LayersContentCustomizeTab: React.FC<TLayersContentCustomizeTabProps> = (props) => {
	const { nodeState, editor } = props;

	return <NodeEditor nodeState={nodeState} editor={editor} />;
};

interface TLayersContentCustomizeTabProps {
	nodeState: TNodeState<TFlatNode>;
	editor: TPageEditor;
}
