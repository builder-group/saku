import { TToken } from '@repo/editor';
import { TNodeResolveContext } from './node-resolve-context';

export interface TMixinResolveContext<
	GTokenValue extends TToken['value'],
	GBaseTokenValue extends TToken['value']
> {
	node: TNodeResolveContext;
	tokenMap: Record<TToken['key'], TToken>;
	mapToTokenValue: (value: GBaseTokenValue) => GTokenValue | undefined;
}
