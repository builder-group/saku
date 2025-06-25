import { TState } from 'feature-state';
import { TEditor } from '../../lib';
import { TBlock } from '../../types';
import { AboutBlockEditor, LinkBlockEditor, MediaBlockEditor, TextBlockEditor } from './editors';

export const blockEditorsRegistry = {
	about: AboutBlockEditor,
	link: LinkBlockEditor,
	media: MediaBlockEditor,
	text: TextBlockEditor
} as const;

export interface TBlockEditorComponentProps<GBlock extends TBlock = TBlock> {
	blockState: TState<GBlock, []>;
	editor: TEditor;
}
