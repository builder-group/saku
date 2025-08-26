import { TNodeId, TPageNode } from '@repo/editor';
import { TSiteResolveContext } from './site-resolve-context';

export interface TNodeResolveContext {
	site: TSiteResolveContext;
	parentId?: TNodeId;
	childMixins?: TPageNode['childMixins']; // TODO: Remove once migrated to token references
}
