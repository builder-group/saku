import { withGlobalBind } from 'feature-react/state';
import React from 'react';
import { createEditor, Editor, TEditor } from '@/features/editor';

const Page: React.FC = () => {
	const editor = React.useMemo<TEditor>(() => {
		const editor = createEditor();
		withGlobalBind(`_editor_${editor.id}`, editor);
		return editor;
	}, []);

	return (
		<div className="h-full w-full bg-red-500">
			<Editor editor={editor} />
		</div>
	);
};

export default Page;
