import React from 'react';
import { TResolvedNode } from '../../types';
import { StaticNode } from './StaticNode';

export const StaticNodeCanvas: React.FC<TCanvasProps> = (props) => {
	const { nodes } = props;

	if (nodes.length === 0) {
		return null;
	}

	return (
		<div className="flex w-full flex-col items-center gap-4">
			{nodes.map((node) => (
				<StaticNode key={node.id} node={node} />
			))}
		</div>
	);
};

interface TCanvasProps {
	nodes: TResolvedNode[];
}
