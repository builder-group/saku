import { TNodeMetadata as TEditorNodeMetadata, TFlatNode } from '@repo/editor';
import { IconSource } from '@shopify/polaris';
import { TResolvedNode } from '../../types';
import { TPageContext, TPageEditor } from '../page';
import { TNodeState } from './create-node-state';

export type TNodeMetadata<GType extends TFlatNode['type']> = {
	type: GType;
	hidden?: boolean;
} & (
	| {
			internal: false;
			icon: IconSource;
			label: TEditorNodeMetadata<GType>['label'];
			defaultBundle: Omit<Extract<TFlatNode, { type: GType }>, 'id'>;
	  }
	| {
			internal: true;
			defaultBundle: Omit<Extract<TFlatNode, { type: GType }>, 'id'>;
	  }
);

export interface TResolvedNodeProps<GResolvedNode extends TResolvedNode>
	extends React.HTMLProps<HTMLDivElement> {
	cx: TPageContext;
	node: GResolvedNode;
	state?: 'loading' | 'error' | 'success';
}

export interface TNodeProps<GNode extends TFlatNode> extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<GNode>;
	editor: TPageEditor;
}

export interface TNodeEditorComponentProps<GNode extends TFlatNode = TFlatNode> {
	nodeState: TNodeState<GNode>;
	editor: TPageEditor;
}
