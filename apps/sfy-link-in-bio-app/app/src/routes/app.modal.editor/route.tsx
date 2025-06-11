import { withGlobalBind } from 'feature-react/state';
import React from 'react';
import { createEditor, Editor, TEditor } from '@/features/editor';
import './styles.module.css';

const Page: React.FC = () => {
	const editor = React.useMemo<TEditor>(() => {
		const editor = createEditor();
		withGlobalBind(`_editor_${editor.id}`, editor);
		return editor;
	}, []);

	return (
		<div className="flex min-h-screen w-full bg-red-500">
			<Editor editor={editor} />
		</div>
	);
};

export default Page;
