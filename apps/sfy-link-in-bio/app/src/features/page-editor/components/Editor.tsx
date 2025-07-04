import React from 'react';
import { useBoundingRectObserver } from '@/hooks';
import { TPageEditor } from '../lib';
import { EditorContent } from './EditorContent';

export const Editor: React.FC<TEditorProps> = (props) => {
	const { editor } = props;

	useBoundingRectObserver(
		editor.editorRef,
		editor.boundingRect._v,
		(rect) => {
			editor.boundingRect.set(rect);
			editor.isReady.set(true);
		},
		[editor]
	);

	React.useEffect(() => {
		editor.loadFonts();
	}, [editor]);

	return (
		<div ref={editor.editorRef} className="flex h-screen w-full flex-col">
			<EditorContent editor={editor} />
		</div>
	);
};

export interface TEditorProps {
	editor: TPageEditor;
}
