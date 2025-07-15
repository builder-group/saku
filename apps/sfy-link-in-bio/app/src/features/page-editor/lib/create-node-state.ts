import { deepCopy } from '@blgc/utils';
import { TNode, TNodeId } from '@repo/editor';
import { createState, TState } from 'feature-state';
import React from 'react';
import { TBoundingRect } from './create-page-editor';

export function createNodeState<GNode extends TNode>(
	node: GNode,
	parentId?: TNodeId
): TNodeState<GNode> {
	const { id, type, ...nodeData } = node;
	const state = createState(nodeData);

	return Object.assign(state, {
		id,
		type,
		parentId,
		ref: React.createRef<HTMLDivElement>(),
		boundingRect: createState<TBoundingRect>({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		}),
		toNode() {
			return {
				id,
				type,
				...state._v
			} as GNode;
		},
		toCopiedNode() {
			return {
				id,
				type,
				...deepCopy(state._v)
			} as GNode;
		}
	});
}

export type TNodeState<GNode extends TNode = TNode> = TState<TNodeStateValue<GNode>, []> & {
	id: TNodeId;
	type: GNode['type'];
	parentId?: TNodeId;
	ref: React.RefObject<HTMLDivElement>;
	boundingRect: TState<TBoundingRect, []>;
	toNode: () => GNode;
	toCopiedNode: () => GNode;
};

// We omit 'id' and 'type' from the state value because they are immutable identifiers in the editor and should not be part of the mutable node state.
export type TNodeStateValue<GNode extends TNode = TNode> = Omit<GNode, 'id' | 'type'>;
