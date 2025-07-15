import { TNodeId, TPageNode } from '@repo/editor';
import { TSiteProvider } from './site-provider';

export interface TNodeResolutionContext {
	site: TSiteProvider;
	parentId?: TNodeId;
	resolved?: {
		parentStyles?: TPageNode['style']['children'];
	};
}
