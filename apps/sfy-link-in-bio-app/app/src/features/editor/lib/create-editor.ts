import { notEmpty, shortId } from '@blgc/utils';
import { createState, TState } from 'feature-state';
import { TViewType } from '../environment';
import { TBlock, TBlockId, TDocumentNode } from '../types';

export function createEditor(documentNode: TDocumentNode): TEditor {
	const pageNode = documentNode.children[0];
	if (pageNode == null || pageNode.type !== 'page') {
		throw new Error('Document must have a page node');
	}
	const blocks = pageNode.blocks;

	const documentId = documentNode.id;
	const pageId = pageNode.id;

	return {
		id: shortId(),

		activeView: createState('blocks' as TViewType),
		boundingRect: createState({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		}),

		selectedBlockId: createState<TBlockId | null>(null),
		blockIds: createState(blocks.map((block) => block.id)),
		blockMap: blocks.reduce(
			(acc, block) => {
				acc[block.id] = createState(block);
				return acc;
			},
			{} as Record<TBlockId, TState<TBlock, []>>
		),

		documentId,
		pageId,

		switchView(view) {
			this.activeView.set(view);
			this.unselectBlock();
		},

		addBlock(block) {
			this.blockMap[block.id] = createState(block);
			this.blockIds.set([...this.blockIds._v, block.id]);
			this.selectBlock(block.id);
		},
		removeBlock(blockId) {
			if (this.selectedBlockId._v === blockId) {
				this.unselectBlock();
			}
			this.blockIds.set(this.blockIds._v.filter((id) => id !== blockId));
			delete this.blockMap[blockId];
		},
		swapBlocks(blockId1, blockId2) {
			const index1 = this.blockIds._v.indexOf(blockId1);
			const index2 = this.blockIds._v.indexOf(blockId2);

			const newBlocks = [...this.blockIds._v];
			const [draggedItem] = newBlocks.splice(index1, 1);
			newBlocks.splice(index2, 0, draggedItem as string);

			this.blockIds.set(newBlocks);
		},
		selectBlock(blockId) {
			if (this.blockMap[blockId] != null) {
				this.selectedBlockId.set(blockId);
			}
		},
		updateBlock(blockId, updates) {
			const blockState = this.blockMap[blockId];
			if (blockState != null) {
				blockState.set((v) => ({ ...v, ...updates }));
			}
		},
		unselectBlock() {
			this.selectedBlockId.set(null);
		},

		async save() {
			const documentNode = this.toDocumentNode();

			console.log({ documentNode });
		},

		toDocumentNode() {
			return {
				type: 'document',
				id: this.documentId,
				version: 'v0.0.1',
				children: [
					{
						type: 'page',
						id: this.pageId,
						blocks: this.blockIds._v.map((id) => this.blockMap[id]?._v).filter(notEmpty)
					}
				]
			};
		}
	};
}

export interface TEditor {
	id: string;

	activeView: TState<TViewType, []>;
	boundingRect: TState<TBoundingRect, []>;

	selectedBlockId: TState<TBlockId | null, []>;
	blockIds: TState<TBlockId[], []>;
	blockMap: Record<TBlockId, TState<TBlock, []>>;

	documentId: string;
	pageId: string;

	switchView: (view: TViewType) => void;

	addBlock: (block: TBlock) => void;
	removeBlock: (blockId: TBlockId) => void;
	swapBlocks: (blockId1: TBlockId, blockId2: TBlockId) => void;
	updateBlock<GBlock extends TBlock>(
		blockId: TBlockId,
		updates: Partial<Omit<GBlock, 'id' | 'type'>>
	): void;
	selectBlock: (blockId: TBlockId) => void;
	unselectBlock: () => void;

	save: () => Promise<void>;

	toDocumentNode: () => TDocumentNode;
}

export interface TBoundingRect {
	left: number;
	top: number;
	bottom: number;
	right: number;
}
