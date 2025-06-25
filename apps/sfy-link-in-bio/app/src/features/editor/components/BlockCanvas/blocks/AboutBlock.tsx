import { useFeatureState } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import type { TAboutBlock } from '../../../types';

export const AboutBlock: React.FC<TAboutBlockProps> = (props) => {
	const { blockState } = props;
	const block = useFeatureState(blockState);

	return <StaticAboutBlock block={block} />;
};

interface TAboutBlockProps {
	blockState: TState<TAboutBlock, []>;
}

export const StaticAboutBlock: React.FC<TStaticAboutBlockProps> = (props) => {
	const { block } = props;

	return (
		<div className="w-full max-w-md">
			{/* Main container with Bento styling */}
			<div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
				{/* Content */}
				<div className="flex flex-col gap-3 p-5">
					{/* Avatar */}
					{block.avatarUrl ? (
						<div className="mx-auto h-16 w-16 flex-shrink-0 overflow-hidden rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.08]">
							<img
								src={block.avatarUrl}
								alt={block.name}
								className="h-full w-full object-cover"
								draggable={false}
							/>
						</div>
					) : (
						<div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-sm text-[#999]">
							?
						</div>
					)}

					{/* Profile Details */}
					<div className="flex flex-col gap-3 text-center">
						<h3 className="text-xl font-medium">{block.name}</h3>

						{block.bio && (
							<div className="line-clamp-6">
								<p className="text-[#666]">{block.bio}</p>
							</div>
						)}
					</div>
				</div>

				{/* Border and highlight effects */}
				<div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/[0.08]" />
				<div className="pointer-events-none absolute inset-[1px] rounded-[23px] ring-1 ring-white/[0.22]" />
			</div>
		</div>
	);
};

interface TStaticAboutBlockProps {
	block: TAboutBlock;
}
