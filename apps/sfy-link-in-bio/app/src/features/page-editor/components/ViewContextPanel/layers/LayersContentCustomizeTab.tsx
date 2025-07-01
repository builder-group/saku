import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode, TPageEditor } from '../../../lib';
import { TNode } from '../../../types';
import { NodeEditor } from '../../NodeEditor';

export const LayersContentCustomizeTab: React.FC<TLayersContentCustomizeTabProps> = (props) => {
	const { nodeState, editor } = props;

	return <NodeEditor nodeState={nodeState} editor={editor} />;
};

interface TLayersContentCustomizeTabProps {
	nodeState: TState<TFlattenedNode<TNode>, []>;
	editor: TPageEditor;
}
