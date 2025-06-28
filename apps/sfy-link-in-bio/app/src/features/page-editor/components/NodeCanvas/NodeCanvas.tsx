import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode, TPageEditor } from '../../lib';
import { TNode } from '../../types';
import { Node } from './Node';

export const NodeCanvas: React.FC<TNodeCanvasProps> = (props) => {
	const { editor, scrollContainerRef } = props;

	const rootNode = React.useMemo(() => editor.getRootNode(), [editor]);

	return (
		<div className="flex w-full flex-col items-center gap-4">
			<Node
				key={rootNode._v.id}
				nodeState={rootNode as TState<TFlattenedNode<TNode>, []>}
				editor={editor}
				scrollContainerRef={scrollContainerRef}
			/>
		</div>
	);
};

interface TNodeCanvasProps {
	editor: TPageEditor;
	scrollContainerRef: React.RefObject<HTMLDivElement>;
}
