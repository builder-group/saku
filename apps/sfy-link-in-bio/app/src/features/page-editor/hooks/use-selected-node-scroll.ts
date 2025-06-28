import { useListener } from 'feature-react';
import { TPageEditor } from '../lib';

export function useSelectedNodeScroll(editor: TPageEditor): void {
	useListener(editor.selectedNodeId, ({ value: selectedNodeId }) => {
		const selectedNode = selectedNodeId == null ? null : editor.nodeMap[selectedNodeId];
		if (selectedNode == null) {
			return;
		}

		const scrollContainer = editor.canvasContainerRef.current;
		if (scrollContainer == null) {
			return;
		}

		// Small delay to ensure the node is rendered at its new position (e.g. if re-ordering nodes)
		setTimeout(() => {
			if (selectedNode == null || scrollContainer == null) {
				return;
			}

			// Get the container's height and scroll position
			const containerHeight = scrollContainer.clientHeight;
			const containerScroll = scrollContainer.scrollTop;
			const containerRect = scrollContainer.getBoundingClientRect();

			// Get the node's position relative to the container
			const nodeRect = selectedNode.boundingRect._v;
			const nodeTop = nodeRect.top - containerRect.top + containerScroll;
			const nodeHeight = nodeRect.bottom - nodeRect.top;

			// Calculate the target scroll position to center the node
			const targetScroll = nodeTop - (containerHeight - nodeHeight) / 2;

			// Smooth scroll to the target position
			scrollContainer.scrollTo({
				top: targetScroll,
				behavior: 'smooth'
			});
		}, 10);
	});
}
