import { TFlatNode } from '@repo/editor';
import React from 'react';
import {
	nodeStyleEditorRegistry,
	TNodeEditorComponentProps,
	TNodeState,
	TPageEditor
} from '../../lib';

export const NodeStyleEditor: React.FC<TNodeStyleEditorProps> = (props) => {
	const { nodeState, editor } = props;

	const EditorComponent = React.useMemo(
		() =>
			nodeStyleEditorRegistry[nodeState._v.type] as React.ComponentType<
				TNodeEditorComponentProps<any>
			>,
		[nodeState]
	);

	return <EditorComponent nodeState={nodeState} editor={editor} />;
};

interface TNodeStyleEditorProps {
	nodeState: TNodeState<TFlatNode>;
	editor: TPageEditor;
}
