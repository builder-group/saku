import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode } from '../../../lib';
import { TMediaNode } from '../../../types';

export const MediaNode: React.FC<TMediaNodeProps> = (props) => {
	const { nodeState } = props;
	const node = useFeatureState(nodeState);

	return <StaticMediaNode node={node} />;
};

interface TMediaNodeProps {
	nodeState: TState<TFlattenedNode<TMediaNode>, []>;
}

export const StaticMediaNode: React.FC<TStaticMediaNodeProps> = (props) => {
	const { node } = props;

	// Only handle image type for now
	if (node.media.type !== 'image') {
		return null;
	}

	return (
		<div className="w-full max-w-md">
			{/* Main container with Bento styling */}
			<div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
				{/* Image Container */}
				<div className="relative w-full">
					{node.media.url ? (
						<img
							src={node.media.url}
							alt={node.media.altText ?? ''}
							className="h-auto w-full object-cover"
							draggable={false}
						/>
					) : (
						<div className="flex aspect-[16/9] w-full items-center justify-center bg-[#f5f5f5] text-sm text-[#999]">
							?
						</div>
					)}
				</div>

				{/* Border and highlight effects */}
				<div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/[0.08]" />
				<div className="pointer-events-none absolute inset-[1px] rounded-[23px] ring-1 ring-white/[0.22]" />
			</div>
		</div>
	);
};

interface TStaticMediaNodeProps {
	node: TMediaNode;
}
