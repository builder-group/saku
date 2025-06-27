import React from 'react';
import { type TNode } from '../../types';
import { StaticAboutNode, StaticLinkNode, StaticMediaNode, StaticTextNode } from './nodes';

export const StaticNode: React.FC<TStaticNodeProps> = (props) => {
	const { node } = props;

	switch (node.type) {
		case 'about':
			return <StaticAboutNode node={node} />;
		case 'link':
			return <StaticLinkNode node={node} />;
		case 'media':
			return <StaticMediaNode node={node} />;
		case 'text':
			return <StaticTextNode node={node} />;
		default:
			return null;
	}
};

interface TStaticNodeProps {
	node: TNode;
}
