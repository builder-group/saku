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

			// Get the iframe's viewport dimensions
			const viewportHeight = iframeWindow.innerHeight;

			// Get the node's position relative to the iframe's document
			const nodeRect = selectedNode.boundingRect._v;
			const nodeTop = nodeRect.top;
			const nodeHeight = nodeRect.bottom - nodeRect.top;

			// Calculate the target scroll position to center the node
			const targetScroll = nodeTop - (viewportHeight - nodeHeight) / 2;

			// Smooth scroll to the target position
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
