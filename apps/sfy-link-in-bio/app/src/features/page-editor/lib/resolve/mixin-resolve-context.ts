import { TTokenSet } from '@repo/editor';
import { TNodeResolveContext } from './node-resolve-context';

export interface TMixinResolveContext<
	GValue extends Record<string, any> | null | undefined,
	GTokenSet extends TTokenSet = TTokenSet
> {
	node: TNodeResolveContext;
	tokenSet: GTokenSet | undefined | null;
	mapToToken: (tokenRef: string, tokenSet?: GTokenSet) => GValue | undefined;
}
