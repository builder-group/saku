import { TNodeResolveContext } from '../../../lib';
import { TSiteHydrateContext } from './site-hydrate-context';

export interface TNodeHydrateContext extends TNodeResolveContext {
	site: TSiteHydrateContext;
}
