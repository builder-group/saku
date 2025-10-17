import React from 'react';
import { TPageContext } from '../../../lib';
import { TResolvedNode } from '../../../types';
import { ResolvedNode } from '../ResolvedNode';

export const StaticNodeCanvas: React.FC<TCanvasProps> = (props) => {
	const { nodes, cx } = props;

	if (nodes.length === 0) {
		return null;
	}

	return (
		<div className="relative h-full w-full">
			{nodes.map((node) => (
				<ResolvedNode key={node.id} node={node} cx={cx} />
			))}
		</div>
	);
};

interface TCanvasProps {
	cx: TPageContext;
	nodes: TResolvedNode[];
}
