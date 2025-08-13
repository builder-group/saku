import { TNode, TNodeId } from '../types';

export interface TMixin<TKey extends string, TValue> {
	key: TKey;
	value: TValue;
}

export type TMergeMixins<TMixins extends TMixin<any, any>[]> = {
	[K in TMixins[number]['key']]: Extract<TMixins[number], { key: K }>['value'];
};

// =========================================================================
// Mixins
// =========================================================================

export type TIdMixin = TMixin<'id', string>;
export type TChildrenMixin = TMixin<'children', TNode[]>;
export type TFlatChildrenMixin = TMixin<'children', TNodeId[]>;
