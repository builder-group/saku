import React from 'react';
import { TPageContext } from '../../lib';
import { TResolvedNode } from '../../types';
import { ResolvedNode } from '../ResolvedNode';

export const StaticNodeCanvas: React.FC<TCanvasProps> = (props) => {
	const { nodes, cx } = props;

	if (nodes.length === 0) {
		return null;
	}

	return nodes.map((node) => <ResolvedNode key={node.id} node={node} cx={cx} />);
};

interface TCanvasProps {
	cx: TPageContext;
	nodes: TResolvedNode[];
}
