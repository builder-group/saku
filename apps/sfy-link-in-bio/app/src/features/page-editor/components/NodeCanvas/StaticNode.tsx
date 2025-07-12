import React from 'react';
import { TResolvedNode } from '../../types';
import {
	StaticAboutNode,
	StaticLinkNode,
	StaticMediaNode,
	StaticPageNode,
	StaticProductNode,
	StaticPromisedNode,
	StaticTextNode
} from './nodes';

export const StaticNode = React.forwardRef<HTMLDivElement, TStaticNodeProps>((props, ref) => {
	const { node } = props;

	switch (node.type) {
		case 'about':
			return <StaticAboutNode ref={ref} node={node} />;
		case 'link':
			return <StaticLinkNode ref={ref} node={node} />;
		case 'media':
			return <StaticMediaNode ref={ref} node={node} />;
		case 'page':
			return <StaticPageNode ref={ref} node={node} />;
		case 'text':
			return <StaticTextNode ref={ref} node={node} />;
		case 'product':
			return <StaticProductNode ref={ref} node={node} />;
		case 'promised':
			return <StaticPromisedNode ref={ref} node={node} />;
		default:
			return null;
	}
});
StaticNode.displayName = 'StaticNode';

interface TStaticNodeProps {
	node: TResolvedNode;
}
