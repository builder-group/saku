import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { cn } from '@/lib';
import { TFlattenedNode, TPageEditor } from '../../lib';
import { TAboutNode, TLinkNode, TMediaNode, TNode, TPageNode, TTextNode } from '../../types';
import { AboutNode, LinkNode, MediaNode, PageNode, TextNode } from './nodes';

export const Node: React.FC<TNodeProps> = (props) => {
	const { nodeState, editor, scrollContainerRef } = props;
	const nodeRef = React.useRef<HTMLDivElement>(null);

	const isSelected = useCompute(
		editor.selectedNodeId,
		(id) => {
			const isSelected = nodeState._v.id === id;

			// Scroll to the node if it is selected,
			// with a small delay to ensure the node is rendered at its new position (e.g. if re-ordering nodes)
			setTimeout(() => {
				if (isSelected && nodeRef.current != null && scrollContainerRef.current != null) {
					const scrollContainer = scrollContainerRef.current;
					// Get the container's height and scroll position
					const containerHeight = scrollContainer.clientHeight;
					const containerScroll = scrollContainer.scrollTop;
					const containerRect = scrollContainer.getBoundingClientRect();

					// Get the node's position relative to the container
					const nodeRect = nodeRef.current.getBoundingClientRect();
					const nodeTop = nodeRect.top - containerRect.top + containerScroll;
					const nodeHeight = nodeRect.height;

					// Calculate the target scroll position to center the node
					const targetScroll = nodeTop - (containerHeight - nodeHeight) / 2;

					// Smooth scroll to the target position
					scrollContainer.scrollTo({
						top: targetScroll,
						behavior: 'smooth'
					});
				}
			}, 10);

			return isSelected;
		},
		[nodeState]
	);

	const renderNode = React.useCallback(() => {
		switch (nodeState._v.type) {
			case 'about':
				return <AboutNode nodeState={nodeState as TState<TFlattenedNode<TAboutNode>, []>} />;
			case 'link':
				return <LinkNode nodeState={nodeState as TState<TFlattenedNode<TLinkNode>, []>} />;
			case 'media':
				return <MediaNode nodeState={nodeState as TState<TFlattenedNode<TMediaNode>, []>} />;
			case 'page':
				return (
					<PageNode
						nodeState={nodeState as TState<TFlattenedNode<TPageNode>, []>}
						editor={editor}
						scrollContainerRef={scrollContainerRef}
					/>
				);
			case 'text':
				return <TextNode nodeState={nodeState as TState<TFlattenedNode<TTextNode>, []>} />;
			default:
				return null;
		}
	}, [nodeState, editor, scrollContainerRef]);

	return (
		<div
			ref={nodeRef}
			className={cn(
				'group relative flex w-full justify-center rounded-r-lg',
				// Selection indicator styles
				isSelected &&
					'bg-neutral-100 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-full before:bg-[#2C6ECB]',
				// Hover indicator styles
				!isSelected &&
					'before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-full before:bg-neutral-200 before:opacity-0 before:transition-opacity hover:bg-neutral-100 hover:before:opacity-100',
				'cursor-pointer'
			)}
			onClick={() => editor.selectNode(nodeState._v.id)}
		>
			{renderNode()}
		</div>
	);
};

interface TNodeProps {
	nodeState: TState<TFlattenedNode<TNode>, []>;
	editor: TPageEditor;
	scrollContainerRef: React.RefObject<HTMLDivElement>;
}
