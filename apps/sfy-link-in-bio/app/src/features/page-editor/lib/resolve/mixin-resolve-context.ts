import { TMixinTokenSet } from '@repo/editor';
import { TNodeResolveContext } from './node-resolve-context';

export interface TMixinResolveContext<
	GValue extends Record<string, any> | null | undefined,
	GTokenSet extends TMixinTokenSet = TMixinTokenSet
> {
	node: TNodeResolveContext;
	tokenSet: GTokenSet | undefined | null;
	mapToToken: (tokenRef: string, tokenSet?: GTokenSet) => GValue | undefined;
}
