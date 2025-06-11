import { shortId } from '@blgc/utils';
import { createState, TState } from 'feature-state';
import { TViewId } from '../environment';

export function createEditor(): TEditor {
	return {
		id: shortId(),
		activeView: createState('blocks' as TViewId),
		blocks: createState([] as TBlockId[]),
		blockMap: {},
		boundingRect: createState({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		})
	};
}

export interface TEditor {
	id: string;
	activeView: TState<TViewId, []>;
	blocks: TState<TBlockId[], []>;
	blockMap: Record<TBlockId, TState<TBlock, []>>;
	boundingRect: TState<TBoundingRect, []>;
}

export interface TBlock {
	id: TBlockId;
}

type TBlockId = string;

export interface TBoundingRect {
	left: number;
	top: number;
	bottom: number;
	right: number;
}
