import React from 'react';
import { TBlock } from '../../types';
import { StaticBlock } from './StaticBlock';

export const StaticBlockCanvas: React.FC<TCanvasProps> = (props) => {
	const { blocks } = props;

	if (blocks.length === 0) {
		return null;
	}

	return (
		<div className="flex w-full flex-col items-center gap-4">
			{blocks.map((block) => (
				<StaticBlock key={block.id} block={block} />
			))}
		</div>
	);
};

interface TCanvasProps {
	blocks: TBlock[];
}
