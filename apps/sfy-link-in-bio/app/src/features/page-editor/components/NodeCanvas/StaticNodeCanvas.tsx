import React from 'react';
import { TPageContext } from '../../lib';
import { TResolvedNode } from '../../types';
import { StaticNode } from './StaticNode';

export const StaticNodeCanvas: React.FC<TCanvasProps> = (props) => {
	const { nodes, cx } = props;

	if (nodes.length === 0) {
		return null;
	}

	return nodes.map((node) => <StaticNode key={node.id} node={node} cx={cx} />);
};

interface TCanvasProps {
	cx: TPageContext;
	nodes: TResolvedNode[];
}
