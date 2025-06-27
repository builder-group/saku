import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TFlattenedNode } from '../../../lib';
import { TTextNode } from '../../../types';

export const TextNode: React.FC<TTextNodeProps> = (props) => {
	const { nodeState } = props;
	const node = useFeatureState(nodeState);

	return <StaticTextNode node={node} />;
};

interface TTextNodeProps {
	nodeState: TState<TFlattenedNode<TTextNode>, []>;
}

export const StaticTextNode: React.FC<TStaticTextNodeProps> = (props) => {
	const { node } = props;

	// Map alignment to Tailwind classes
	const getAlignmentClasses = (alignment: 'left' | 'center' | 'right'): string => {
		switch (alignment) {
			case 'left':
				return 'text-left';
			case 'center':
				return 'text-center';
			case 'right':
				return 'text-right';
			default:
				return 'text-left';
		}
	};

	return (
		<div className="w-full max-w-md">
			{/* Main container with Bento styling */}
			<div className="relative overflow-hidden rounded-3xl bg-white shadow-sm transition-colors hover:bg-[#f5f5f5]">
				{/* Text Content */}
				<div className="flex min-h-[96px] w-full flex-col justify-start p-4">
					<p
						className={`m-0 text-base leading-relaxed break-words text-[#333333] ${getAlignmentClasses(
							node.alignment
						)}`}
					>
						{node.text || 'Empty text...'}
					</p>
				</div>

				{/* Border and highlight effects */}
				<div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/[0.08]" />
				<div className="pointer-events-none absolute inset-[1px] rounded-[23px] ring-1 ring-white/[0.22]" />
			</div>
		</div>
	);
};

interface TStaticTextNodeProps {
	node: TTextNode;
}
