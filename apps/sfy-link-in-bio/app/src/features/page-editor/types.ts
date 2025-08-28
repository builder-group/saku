import { TSite } from '@repo/editor';
import {
	TResolvedAboutNode,
	TResolvedLinkNode,
	TResolvedMediaNode,
	TResolvedPageNode,
	TResolvedProductNode,
	TResolvedPromisedNode,
	TResolvedTextNode
} from './nodes';

export interface TResolvedSite extends Omit<TSite, 'root' | 'assets' | 'integrations' | 'tokens'> {
	root: TResolvedPageNode;
}

export type TResolvedNode =
	| TResolvedPageNode
	| TResolvedAboutNode
	| TResolvedLinkNode
	| TResolvedMediaNode
	| TResolvedTextNode
	| TResolvedProductNode
	| TResolvedPromisedNode<any>;
