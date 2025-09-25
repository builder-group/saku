import { TToken } from '@repo/editor';
import { TNodeResolveContext } from './node-resolve-context';

export interface TMixinResolveContext {
	node: TNodeResolveContext;
	tokenMap: Record<TToken['key'], TToken>;
}
