import { TSiteHydrateContext } from '../../../.server';
import { TNodeResolveContext } from '../types';

export interface TNodeHydrateContext extends TNodeResolveContext {
	site: TSiteHydrateContext;
}
