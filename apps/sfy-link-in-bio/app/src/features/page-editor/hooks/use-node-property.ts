import { TFlatNode } from '@repo/editor';
import { TState } from 'feature-state';
import { useMapState } from '@/hooks';
import { TNodeState } from '../lib';

export function useNodeProperty<GNode extends TFlatNode, TMixinKey extends keyof GNode>(
	nodeState: TNodeState<GNode>,
	key: TMixinKey
): TState<GNode[TMixinKey], any> {
	return useMapState(nodeState, {
		map(baseValue) {
			return baseValue[key];
		},
		sync(baseState, mappedValue, notifyOptions) {
			baseState._v[key] = mappedValue;
			baseState._notify(notifyOptions);
		},
		isEqual: false // Mixin objects are mutable references - we need to always update when the base state changes, even if the object reference is the same
	});
}
