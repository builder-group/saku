import { TNodeId } from '@repo/editor';
import { TSiteResolveContext } from './site-resolve-context';

export interface TNodeResolveContext {
	site: TSiteResolveContext;
	parentId?: TNodeId;
}
