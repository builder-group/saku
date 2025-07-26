import { TIntegration, TIntegrationId } from '@repo/editor';
import { TNodeResolveContext, TSiteResolveContext } from '../../../lib';

export interface TNodeHydrateContext extends TNodeResolveContext {
	site: TSiteHydrateContext;
}

export interface TSiteHydrateContext extends TSiteResolveContext {
	id: string;
	handle: string;
	getIntegration(id: TIntegrationId): TIntegration | null;
}
