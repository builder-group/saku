import { shortId } from '@blgc/utils';
import { createState, TState } from 'feature-state';
import { TBlock, TBlockId, TViewType } from '../environment';

export function createEditor(blocks: TBlock[] = []): TEditor {
	return {
		id: shortId(),
		activeView: createState('blocks' as TViewType),
		blocks: createState(blocks.map((block) => block.id)),
		blockMap: blocks.reduce(
			(acc, block) => {
				acc[block.id] = createState(block);
				return acc;
			},
			{} as Record<TBlockId, TState<TBlock, []>>
		),
		boundingRect: createState({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		}),
		addBlock(block) {
			this.blockMap[block.id] = createState(block);
			this.blocks.set([...this.blocks._v, block.id]);
		},
		removeBlock(blockId) {
			this.blocks.set(this.blocks._v.filter((id) => id !== blockId));
			delete this.blockMap[blockId];
		}
	};
}

export interface TEditor {
	id: string;
	activeView: TState<TViewType, []>;
	blocks: TState<TBlockId[], []>;
	blockMap: Record<TBlockId, TState<TBlock, []>>;
	boundingRect: TState<TBoundingRect, []>;
	addBlock: (block: TBlock) => void;
	removeBlock: (blockId: TBlockId) => void;
}

export interface TBoundingRect {
	left: number;
	top: number;
	bottom: number;
	right: number;
}
