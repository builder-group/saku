import { shortId } from '@blgc/utils';
import { createState, TState } from 'feature-state';
import { TViewId } from '../environment';

export function createEditor(): TEditor {
	return {
		id: shortId(),
		activeView: createState('blocks' as TViewId),
		blocks: createState([] as TBlockId[]),
		blockMap: {}
	};
}

export interface TEditor {
	id: string;
	activeView: TState<TViewId, []>;
	blocks: TState<TBlockId[], []>;
	blockMap: Record<TBlockId, TState<TBlock, []>>;
}

export interface TBlock {
	id: TBlockId;
}

type TBlockId = string;
