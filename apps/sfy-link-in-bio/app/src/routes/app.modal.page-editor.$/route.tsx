import { useLoaderData } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { withGlobalBind } from 'feature-react/state';
import React from 'react';
import { coreApiClient } from '@/environment';
import {
	createPageEditor,
	Editor,
	siteNodePreset,
	TPageNode,
	TSiteNode
} from '@/features/page-editor';
import { TLoaderFunction } from '@/types';
import './styles.module.css';

const Page: React.FC = () => {
	const { site } = useLoaderData<typeof loader>();
	const shopify = useAppBridge();

	const editor = React.useMemo(() => {
		if (site == null) {
			return null;
		}

		const editor = createPageEditor(site.id, shopify, site.node.children[0] as TPageNode);
		withGlobalBind(`__editor_${editor.id}`, editor);
		return editor;
	}, [site, shopify]);

	return (
		<div className="flex min-h-screen w-full">
			{editor != null ? <Editor editor={editor} /> : <div>No site</div>}
		</div>
	);
};

export default Page;

export const loader: TLoaderFunction<TLoaderData> = async ({ request }) => {
	const url = new URL(request.url);
	const siteId = url.searchParams.get('siteId');
	if (siteId == null) {
		return {
			site: null
		};
	}

	if (siteId === 'preset') {
		return {
			site: {
				id: siteId,
				node: siteNodePreset
			}
		};
	}

	const siteResult = await coreApiClient.get('/v1/site/{siteId}', {
		pathParams: {
			siteId
		}
	});
	if (siteResult.isErr()) {
		return {
			site: null
		};
	}

	return {
		site: {
			id: siteId,
			node: siteResult.value.data.content as unknown as TSiteNode
		}
	};
};

interface TLoaderData {
	site: {
		id: string;
		node: TSiteNode;
	} | null;
}
