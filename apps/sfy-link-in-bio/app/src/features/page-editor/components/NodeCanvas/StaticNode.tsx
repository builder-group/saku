import React from 'react';
import { TResolvedNode } from '../../types';
import {
	StaticAboutNode,
	StaticLinkNode,
	StaticMediaNode,
	StaticPageNode,
	StaticProductNode,
	StaticPromisedNode,
	StaticTextNode,
	TStaticNodeProps
} from './nodes';

export const StaticNode = React.forwardRef<HTMLDivElement, TStaticNodeProps<TResolvedNode>>(
	(props, ref) => {
		const { node, state, cx } = props;

		switch (node.type) {
			case 'about':
				return <StaticAboutNode ref={ref} node={node} state={state} cx={cx} />;
			case 'link':
				return <StaticLinkNode ref={ref} node={node} state={state} cx={cx} />;
			case 'media':
				return <StaticMediaNode ref={ref} node={node} state={state} cx={cx} />;
			case 'page':
				return <StaticPageNode ref={ref} node={node} state={state} cx={cx} />;
			case 'text':
				return <StaticTextNode ref={ref} node={node} state={state} cx={cx} />;
			case 'product':
				return <StaticProductNode ref={ref} node={node} state={state} cx={cx} />;
			case 'promised':
				return <StaticPromisedNode ref={ref} node={node} state={state} cx={cx} />;
			default:
				return null;
		}
	}
);
StaticNode.displayName = 'StaticNode';
