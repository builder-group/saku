import { TNode } from '@repo/editor';
import { TState } from 'feature-state';
import { TFlattenedNode, TPageEditor } from '../../lib';
import { AboutNodeEditor, LinkNodeEditor, MediaNodeEditor, TextNodeEditor } from './editors';
import { ProductNodeEditor } from './editors/ProductNodeEditor';

export const nodeEditorRegistry = {
	site: null,
	page: null,
	about: AboutNodeEditor,
	link: LinkNodeEditor,
	media: MediaNodeEditor,
	text: TextNodeEditor,
	product: ProductNodeEditor
} as const;

export interface TNodeEditorComponentProps<GNode extends TNode = TNode> {
	nodeState: TState<TFlattenedNode<GNode>, []>;
	editor: TPageEditor;
}
