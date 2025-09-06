import { TMixinTokenSet, TVariableToken } from '@repo/editor';
import { TNodeResolveContext } from './node-resolve-context';

export interface TMixinResolveContext<
	GValue extends Record<string, any> | null | undefined,
	GMixinTokenSet extends TMixinTokenSet = TMixinTokenSet
> {
	node: TNodeResolveContext;
	mixinTokenSet: GMixinTokenSet | undefined | null;
	mapToMixinTokenValue: (tokenKey: string, tokenSet?: GMixinTokenSet) => GValue | undefined;
	variableTokenMap: Record<string, TVariableToken> | undefined | null;
}
