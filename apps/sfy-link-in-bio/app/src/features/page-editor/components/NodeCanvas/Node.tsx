import {
	TAboutNode,
	TFlatNode,
	TFlatPageNode,
	TLinkNode,
	TMediaNode,
	TProductNode,
	TTextNode
} from '@repo/editor';
import React from 'react';
import { useBoundingRectObserver } from '@/hooks';
import { TNodeState } from '../../lib';
import {
	AboutNode,
	LinkNode,
	MediaNode,
	PageNode,
	ProductNode,
	TextNode,
	TNodeProps
} from './nodes';

export const Node: React.FC<TNodeProps<TFlatNode>> = (props) => {
	const { nodeState, editor } = props;

	useBoundingRectObserver(
		nodeState.ref,
		nodeState.boundingRect._v,
		(rect) => {
			nodeState.boundingRect.set(rect);
		},
		[nodeState]
	);

	switch (nodeState.type) {
		case 'page':
			return (
				<PageNode
					ref={nodeState.ref}
					nodeState={nodeState as TNodeState<TFlatPageNode>}
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
		case 'product':
			return (
				<ProductNode
					ref={nodeState.ref}
					nodeState={nodeState as TNodeState<TProductNode>}
					editor={editor}
				/>
			);
		default:
			return null;
	}
};
