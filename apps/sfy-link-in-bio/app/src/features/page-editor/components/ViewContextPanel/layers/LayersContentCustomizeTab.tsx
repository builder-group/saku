import { TFlatNode } from '@repo/editor';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../lib';
import { NodeEditor } from '../../NodeEditor';

export const LayersContentCustomizeTab: React.FC<TLayersContentCustomizeTabProps> = (props) => {
	const { nodeState, editor } = props;

	return <NodeEditor nodeState={nodeState} editor={editor} />;
};

interface TLayersContentCustomizeTabProps {
	nodeState: TNodeState<TFlatNode>;
	editor: TPageEditor;
}
