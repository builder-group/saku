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
		withGlobalBind(`__editor_${editor.id}`, editor);
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
				type: 'about',
				styles: {},
				name: 'Saku',
				bio: 'I am a link in bio',
				avatarUrl:
					'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXRmanFzZ3RwZ3c1cjM0cnN5N2pkbXN2NXA1N2h4eWRkcDBsZWF3cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ANbD1CCdA3iI8/giphy.gif'
			},
			{
				id: shortId(),
				type: 'link',
				styles: {},
				url: 'https://www.shopify.com'
			},
			{
				id: shortId(),
				type: 'link',
				styles: {},
				url: 'https://www.apps.shopify.com'
			},
			{
				id: shortId(),
				type: 'media',
				styles: {},
				media: {
					type: 'image',
					url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dzkxMTZlNGp4N3dhdGJwNWtuMWJtd3JpNHl2bTNzemE3YjFvaTFieCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/so8KXAphERsre/giphy.gif',
					altText: 'Image'
				}
			}
		]
	};
};

interface TLoaderData {
	blocks: TBlock[];
}
