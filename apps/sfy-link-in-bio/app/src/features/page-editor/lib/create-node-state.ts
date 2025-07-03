import { TNode } from '@repo/editor';
import { createState, TState } from 'feature-state';
import React from 'react';
import { TBoundingRect } from './create-page-editor';
import { TFlattenedNode } from './flatten-node';

export function createNodeState(node: TFlattenedNode<TNode>): TNodeState {
	const state = createState(node);

	return Object.assign(state, {
		ref: React.createRef<HTMLDivElement>(),
		boundingRect: createState<TBoundingRect>({
			left: 0,
			top: 0,
			bottom: 0,
			right: 0
		})
	});
}

export type TNodeState<GNode extends TNode = TNode> = TState<TFlattenedNode<GNode>, []> & {
	ref: React.RefObject<HTMLDivElement>;
	boundingRect: TState<TBoundingRect, []>;
};
