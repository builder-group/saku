import { TResolvedSite } from '@/features/page-editor';
import { TMetaFunction } from '@/types';

// https://api.reactrouter.com/v7/types/react_router.MetaDescriptor.html
export function getSiteMetadata(site: TResolvedSite): ReturnType<TMetaFunction> {
	const metadata = [
		{ tagName: 'link', rel: 'icon', href: site.root.metadata.favicon },
		{ title: site.root.metadata.title },
		{
			name: 'description',
			content: site.root.metadata.description
		},
		{
			property: 'og:title',
			content: site.root.metadata.title
		},
		{
			property: 'og:description',
			content: site.root.metadata.description
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image'
		},
		{
			name: 'twitter:title',
			content: site.root.metadata.title
		},
		{
			name: 'twitter:description',
			content: site.root.metadata.description
		}
	];

	// Add font links if available
	if (site.fontUrls.length > 0) {
		site.fontUrls.forEach((fontUrl) => {
			metadata.push({
				tagName: 'link',
				rel: 'stylesheet',
				href: fontUrl
			});
		});
	}

	// Add OpenGraph image if available
	if (site.root.metadata.image != null) {
		metadata.push({
			property: 'og:image',
			content: site.root.metadata.image
		});
		metadata.push({
			name: 'twitter:image',
			content: site.root.metadata.image
		});
	}

	return metadata;
}
