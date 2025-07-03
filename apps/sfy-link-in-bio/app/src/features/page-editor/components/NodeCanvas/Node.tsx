import { TAboutNode, TLinkNode, TMediaNode, TPageNode, TTextNode } from '@repo/editor';
import React from 'react';
import { useBoundingRectObserver } from '@/hooks';
import { TNodeState, TPageEditor } from '../../lib';
import { AboutNode, LinkNode, MediaNode, PageNode, TextNode } from './nodes';

export const Node: React.FC<TNodeProps> = (props) => {
	const { nodeState, editor } = props;

	useBoundingRectObserver(
		nodeState.ref,
		nodeState.boundingRect._v,
		(rect) => {
			nodeState.boundingRect.set(rect);
		},
		[nodeState]
	);

	switch (nodeState._v.type) {
		case 'page':
			return (
				<PageNode
					ref={nodeState.ref}
					nodeState={nodeState as TNodeState<TPageNode>}
					editor={editor}
				/>
			);
		case 'about':
			return (
				<AboutNode
					ref={nodeState.ref}
					nodeState={nodeState as TNodeState<TAboutNode>}
					editor={editor}
				/>
			);
		case 'link':
			return (
				<LinkNode
					ref={nodeState.ref}
					nodeState={nodeState as TNodeState<TLinkNode>}
					editor={editor}
				/>
			);
		case 'media':
			return (
				<MediaNode
					ref={nodeState.ref}
					nodeState={nodeState as TNodeState<TMediaNode>}
					editor={editor}
				/>
			);
		case 'text':
			return (
				<TextNode
					ref={nodeState.ref}
					nodeState={nodeState as TNodeState<TTextNode>}
					editor={editor}
				/>
			);
		default:
			return null;
	}
};

interface TNodeProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
