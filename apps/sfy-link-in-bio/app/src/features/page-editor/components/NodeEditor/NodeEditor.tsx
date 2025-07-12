import { TNode } from '@repo/editor';
import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode, TPageEditor } from '../../lib';
import { nodeEditorRegistry, TNodeEditorComponentProps } from './nodeEditorRegistry';

export const NodeEditor: React.FC<TNodeEditorProps> = (props) => {
	const { nodeState, editor } = props;

	const EditorComponent = React.useMemo(
		() =>
			nodeEditorRegistry[nodeState._v.type] as React.ComponentType<TNodeEditorComponentProps<any>>,
		[nodeState]
	);

	return <EditorComponent nodeState={nodeState} editor={editor} />;
};

interface TNodeEditorProps {
	nodeState: TState<TFlattenedNode<TNode>, []>;
	editor: TPageEditor;
}
