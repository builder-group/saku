import React from 'react';
import { useBoundingRectObserver } from '@/hooks';
import { ResizablePanelGroup } from '../../../../components';
import { TPageEditor } from '../../lib';
import { EditorView } from './views';

export const PageEditor: React.FC<TPageEditorProps> = (props) => {
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
			<ResizablePanelGroup direction="horizontal" className="flex-1">
				<EditorView editor={editor} />
			</ResizablePanelGroup>
		</div>
	);
};

interface TPageEditorProps {
	editor: TPageEditor;
}
