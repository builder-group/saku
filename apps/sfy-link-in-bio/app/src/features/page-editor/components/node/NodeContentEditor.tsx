import { TFlatNode } from '@repo/editor';
import React from 'react';
import {
	nodeContentEditorRegistry,
	TNodeEditorComponentProps,
	TNodeState,
	TPageEditor
} from '../../lib';

export const NodeContentEditor: React.FC<TNodeContentEditorProps> = (props) => {
	const { nodeState, editor, className } = props;

	const EditorComponent = React.useMemo(
		() =>
			nodeContentEditorRegistry[nodeState._v.type] as React.ComponentType<
				TNodeEditorComponentProps<any>
			>,
		[nodeState]
	);

	return <EditorComponent nodeState={nodeState} editor={editor} className={className} />;
};

interface TNodeContentEditorProps {
	nodeState: TNodeState<TFlatNode>;
	editor: TPageEditor;
	className?: string;
}
