import { TToken } from '@repo/editor';
import { TNodeResolveContext } from './node-resolve-context';

export interface TMixinResolveContext<GTokenValue extends TToken['value'], GBaseValue> {
	node: TNodeResolveContext;
	tokenMap: Record<TToken['key'], TToken>;
	mapToTokenValue: (value: GBaseValue) => GTokenValue | undefined;
}
