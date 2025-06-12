import { shortId } from '@blgc/utils';
import { useLoaderData } from '@remix-run/react';
import { withGlobalBind } from 'feature-react/state';
import React from 'react';
import { createEditor, Editor, TBlock, TEditor } from '@/features/editor';
import { TLoaderFunction } from '@/types';
import './styles.module.css';

const Page: React.FC = () => {
	const { blocks } = useLoaderData<typeof loader>();

	const editor = React.useMemo<TEditor>(() => {
		const editor = createEditor(blocks);
		withGlobalBind(`_editor_${editor.id}`, editor);
		return editor;
	}, [blocks]);

	return (
		<div className="flex min-h-screen w-full">
			<Editor editor={editor} />
		</div>
	);
};

export default Page;

export const loader: TLoaderFunction<TLoaderData> = async ({ request }) => {
	// TODO: Load actual data from the database

	return {
		blocks: [
			{
				id: shortId(),
				type: 'header'
			},
			{
				id: shortId(),
				type: 'link'
			},
			{
				id: shortId(),
				type: 'link'
			},
			{
				id: shortId(),
				type: 'media'
			}
		]
	};
};

interface TLoaderData {
	blocks: TBlock[];
}
