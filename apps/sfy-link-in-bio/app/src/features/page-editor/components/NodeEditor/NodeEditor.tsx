import { TFlatNode } from '@repo/editor';
import React from 'react';
import { nodeEditorRegistry, TNodeEditorComponentProps, TNodeState, TPageEditor } from '../../lib';

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
	nodeState: TNodeState<TFlatNode>;
	editor: TPageEditor;
}
