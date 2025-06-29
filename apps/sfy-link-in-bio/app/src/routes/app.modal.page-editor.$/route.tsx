import { useLoaderData } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { withGlobalBind } from 'feature-react/state';
import React from 'react';
import { coreApiClient } from '@/environment';
import { createPageEditor, Editor, kangarooPreset, TSite } from '@/features/page-editor';
import { TLoaderFunction } from '@/types';
import './styles.module.css';

const Page: React.FC = () => {
	const { site } = useLoaderData<typeof loader>();
	const shopify = useAppBridge();

	const editor = React.useMemo(() => {
		if (site == null) {
			return null;
		}

		const editor = createPageEditor(site, shopify);
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
			site: kangarooPreset
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
		site: Object.assign(siteResult.value.data.content as unknown as TSite, {
			id: siteId
		})
	};
};

interface TLoaderData {
	site: TSite | null;
}
