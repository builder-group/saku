import { useListener } from 'feature-react';
import React from 'react';
import { TPageEditor } from '../lib';

export function useSelectedNodeScroll(editor: TPageEditor): void {
	const scrollToSelectedNode = React.useCallback(() => {
		const selectedNodeId = editor.selectedNodeId._v;
		const selectedNode = selectedNodeId == null ? null : editor.nodeMap[selectedNodeId];
		if (selectedNode == null) {
			return;
		}

		const iframe = editor.canvasContainerRef.current;
		const iframeWindow = iframe?.contentWindow;
		if (iframeWindow == null) {
			return;
		}

		// Small delay to ensure the node is rendered at its new position (e.g. when re-ordering nodes)
		setTimeout(() => {
			if (selectedNode == null || iframeWindow == null) {
				return;
			}

			// Use iframe viewport height (since the iframe is the scrollable container)
			const viewportHeight = iframeWindow.innerHeight;
			const nodeRect = selectedNode.boundingRect._v;
			const canvasRect = editor.canvasBoundingRect._v;
			const nodeTop = nodeRect.top - canvasRect.top;
			const nodeHeight = nodeRect.bottom - nodeRect.top;

			// Center node within the visible viewport
			const targetScroll = nodeTop - (viewportHeight - nodeHeight) / 2;

			iframeWindow.scrollTo({
				top: targetScroll,
				behavior: 'smooth'
			});
		}, 50);
	}, [editor]);

	// Scroll when selection changes
	useListener(editor.selectedNodeId, () => {
		scrollToSelectedNode();
	});

	// Scroll when dragging ends (to show new position)
	useListener(editor.isDraggingLayer, ({ value: isDragging }) => {
		if (!isDragging) {
			scrollToSelectedNode();
		}
	});
}
