import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { cn } from '@/lib';
import { TAboutBlock, TLinkBlock, TMediaBlock, TTextBlock, type TBlock } from '../../environment';
import { TEditor } from '../../lib';
import { AboutBlock, LinkBlock, MediaBlock, TextBlock } from './blocks';

export const Block: React.FC<TBlockProps> = (props) => {
	const { blockState, editor, scrollContainerRef } = props;
	const blockRef = React.useRef<HTMLDivElement>(null);

	const isSelected = useCompute(
		editor.selectedBlockId,
		(id) => {
			const isSelected = blockState._v.id === id;

			if (isSelected && blockRef.current && scrollContainerRef.current) {
				const scrollContainer = scrollContainerRef.current;
				// Get the container's height and scroll position
				const containerHeight = scrollContainer.clientHeight;
				const containerScroll = scrollContainer.scrollTop;
				const containerRect = scrollContainer.getBoundingClientRect();

				// Get the block's position relative to the container
				const blockRect = blockRef.current.getBoundingClientRect();
				const blockTop = blockRect.top - containerRect.top + containerScroll;
				const blockHeight = blockRect.height;

				// Calculate the target scroll position to center the block
				const targetScroll = blockTop - (containerHeight - blockHeight) / 2;

				// Smooth scroll to the target position
				scrollContainer.scrollTo({
					top: targetScroll,
					behavior: 'smooth'
				});
			}

			return isSelected;
		},
		[blockState]
	);

	const renderBlock = () => {
		switch (blockState._v.type) {
			case 'about':
				return <AboutBlock blockState={blockState as TState<TAboutBlock, []>} />;
			case 'link':
				return <LinkBlock blockState={blockState as TState<TLinkBlock, []>} />;
			case 'media':
				return <MediaBlock blockState={blockState as TState<TMediaBlock, []>} />;
			case 'text':
				return <TextBlock blockState={blockState as TState<TTextBlock, []>} />;
			default:
				return null;
		}
	};

	return (
		<div
			ref={blockRef}
			className={cn(
				'group relative flex w-full justify-center rounded-r-lg',
				// Selection indicator styles
				isSelected &&
					'bg-neutral-100 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-full before:bg-[#2C6ECB]',
				// Hover indicator styles
				!isSelected &&
					'before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-full before:bg-neutral-200 before:opacity-0 before:transition-opacity hover:bg-neutral-100 hover:before:opacity-100',
				'cursor-pointer'
			)}
			onClick={() => editor.selectBlock(blockState._v.id)}
		>
			{renderBlock()}
		</div>
	);
};

interface TBlockProps {
	blockState: TState<TBlock, []>;
	editor: TEditor;
	scrollContainerRef: React.RefObject<HTMLDivElement>;
}
