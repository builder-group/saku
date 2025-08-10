import { deepCopy } from '@blgc/utils';
import { TFlatNode, TNodeId } from '@repo/editor';
import { createState, TState } from 'feature-state';
import React from 'react';
import { TBoundingRect } from '../page';

export function createNodeState<GNode extends TFlatNode>(
	node: GNode,
	parentId?: TNodeId
): TNodeState<GNode> {
	const state = createState(node, {
		// Use sync queue to prevent cursor jumping in controlled inputs
		// (e.g., TextField in TextNodeEditor) by ensuring state updates
		// happen in the same event loop tick as user interactions
		queue: 'sync'
	});

	return Object.assign(state, {
		get id() {
			// Note: 'this' doesn't work in getter
			return state._v.id;
		},
		get type() {
			// Note: 'this' doesn't work in getter
			return state._v.type;
		},
		parentId,
		ref: React.createRef<HTMLDivElement>(),
		boundingRect: createState<TBoundingRect>({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		}),
		copied(this: TNodeState<GNode>) {
			return deepCopy(this._v);
		}
	});
}

export type TNodeState<GNode extends TFlatNode = TFlatNode> = TState<GNode, []> & {
	id: TNodeId;
	type: GNode['type'];
	parentId?: TNodeId;
	ref: React.RefObject<HTMLDivElement>;
	boundingRect: TState<TBoundingRect, []>;
	copied: () => GNode;
};
