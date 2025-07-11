import { TNode } from '@repo/editor';
import { TState } from 'feature-state';
import { TFlattenedNode, TPageEditor } from '../../lib';
import {
	AboutNodeEditor,
	LinkNodeEditor,
	MediaNodeEditor,
	PageNodeEditor,
	ProductNodeEditor,
	TextNodeEditor
} from './editors';

export const nodeEditorRegistry = {
	site: null,
	page: PageNodeEditor,
	about: AboutNodeEditor,
	link: LinkNodeEditor,
	media: MediaNodeEditor,
	text: TextNodeEditor,
	product: ProductNodeEditor,
	asset: null,
	promised: null
} as const;

export interface TNodeEditorComponentProps<GNode extends TNode = TNode> {
	nodeState: TState<TFlattenedNode<GNode>, []>;
	editor: TPageEditor;
}
