import { TIntegration, TIntegrationId } from '@repo/editor';
import { TSiteResolveContext } from '../../lib';

export interface TSiteHydrateContext extends TSiteResolveContext {
	id: string;
	handle: string;
	getIntegration(id: TIntegrationId): TIntegration | null;
}
