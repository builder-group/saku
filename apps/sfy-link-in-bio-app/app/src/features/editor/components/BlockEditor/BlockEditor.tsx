import { useCompute } from 'feature-react/state';
import { TState } from 'feature-state';
import React from 'react';
import { TBlock } from '../../environment';
import { TEditor } from '../../lib';
import { blockEditorsRegistry, TBlockEditorComponentProps } from './blockEditorsRegistry';

export const BlockEditor: React.FC<TBlockEditorProps> = (props) => {
	const { blockState, editor } = props;

	const EditorComponent = useCompute(
		blockState,
		(block) =>
			blockEditorsRegistry[block.type] as React.ComponentType<TBlockEditorComponentProps<any>>,
		[blockState]
	);

	return (
		<div className="space-y-4 p-4">
			<EditorComponent blockState={blockState} editor={editor} />
		</div>
	);
};

interface TBlockEditorProps {
	blockState: TState<TBlock, []>;
	editor: TEditor;
}
