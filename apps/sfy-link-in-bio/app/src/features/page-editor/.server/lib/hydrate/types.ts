import { TNodeResolveContext, TSiteResolveContext } from '../../../lib';

export interface TNodeHydrateContext extends TNodeResolveContext {
	site: TSiteHydrateContext;
}

export interface TSiteHydrateContext extends TSiteResolveContext {
	shopId: string;
	handle: string;
}
