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
		const { node, state } = props;

		switch (node.type) {
			case 'about':
				return <StaticAboutNode ref={ref} node={node} state={state} />;
			case 'link':
				return <StaticLinkNode ref={ref} node={node} state={state} />;
			case 'media':
				return <StaticMediaNode ref={ref} node={node} state={state} />;
			case 'page':
				return <StaticPageNode ref={ref} node={node} state={state} />;
			case 'text':
				return <StaticTextNode ref={ref} node={node} state={state} />;
			case 'product':
				return <StaticProductNode ref={ref} node={node} state={state} />;
			case 'promised':
				return <StaticPromisedNode ref={ref} node={node} state={state} />;
			default:
				return null;
		}
	}
);
StaticNode.displayName = 'StaticNode';
