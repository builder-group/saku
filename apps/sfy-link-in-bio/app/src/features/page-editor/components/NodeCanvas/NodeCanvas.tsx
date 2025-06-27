import { notEmpty } from '@blgc/utils';
import { useCompute } from 'feature-react';
import React from 'react';
import { TPageEditor } from '../../lib';
import { Node } from './Node';

export const NodeCanvas: React.FC<TNodeCanvasProps> = (props) => {
	const { editor, scrollContainerRef } = props;

	const rootNode = React.useMemo(() => editor.getRootNode(), [editor]);
	const nodes = useCompute(rootNode, (rootNode) => {
		return rootNode.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty);
	});

	if (nodes.length === 0) {
		return null;
	}

	return (
		<div className="flex w-full flex-col items-center gap-4">
			{nodes.map((node) => (
				<Node
					key={node._v.id}
					nodeState={node}
					editor={editor}
					scrollContainerRef={scrollContainerRef}
				/>
			))}
		</div>
	);
};

interface TNodeCanvasProps {
	editor: TPageEditor;
	scrollContainerRef: React.RefObject<HTMLDivElement>;
}
