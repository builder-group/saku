import React from 'react';
import { useBoundingRectObserver } from '@/hooks';
import { useSelectedNodeScroll } from '../../hooks';
import { TPageEditor } from '../../lib';
import { Node } from '../Node';
import { NodeIndicators } from './NodeIndicators';

export const NodeCanvas: React.FC<TNodeCanvasProps> = (props) => {
	const { editor } = props;

	const rootNodeState = React.useMemo(
		() => editor.nodeMap[editor.rootNodeId],
		[editor.nodeMap, editor.rootNodeId]
	);

	useBoundingRectObserver(
		editor.canvasRef,
		editor.canvasBoundingRect._v,
		(rect) => {
			editor.canvasBoundingRect.set(rect);
		},
		[]
	);

	useSelectedNodeScroll(editor);

	if (rootNodeState == null) {
		return null;
	}

	return (
		<div ref={editor.canvasRef} className="relative h-full w-full">
			<NodeIndicators editor={editor} />
			<Node key={rootNodeState.id} nodeState={rootNodeState} editor={editor} />
		</div>
	);
};

interface TNodeCanvasProps {
	editor: TPageEditor;
}
