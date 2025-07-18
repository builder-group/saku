import { TFlatNode } from '@repo/editor';
import { TNodeState, TPageEditor } from '../../lib';
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
	promised: null
} as const;

export interface TNodeEditorComponentProps<GNode extends TFlatNode = TFlatNode> {
	nodeState: TNodeState<GNode>;
	editor: TPageEditor;
}
