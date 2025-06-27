import { shortId } from '@blgc/utils';
import { TSiteNode } from './types';

export const siteNodePreset: TSiteNode = {
	type: 'site',
	id: 'root',
	version: 'v0.0.1',
	children: [
		{
			type: 'page',
			id: shortId(),
			children: [
				{
					id: shortId(),
					type: 'about',
					name: 'Saku',
					bio: 'I am a link in bio',
					avatarUrl:
						'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXRmanFzZ3RwZ3c1cjM0cnN5N2pkbXN2NXA1N2h4eWRkcDBsZWF3cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ANbD1CCdA3iI8/giphy.gif'
				},
				{
					id: shortId(),
					type: 'link',
					url: 'https://www.saku.so'
				},
				{
					id: shortId(),
					type: 'link',
					url: 'https://www.shopify.com'
				},
				{
					id: shortId(),
					type: 'media',
					media: {
						type: 'image',
						url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dzkxMTZlNGp4N3dhdGJwNWtuMWJtd3JpNHl2bTNzemE3YjFvaTFieCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/so8KXAphERsre/giphy.gif',
						altText: 'Image'
					}
				},
				{
					id: shortId(),
					type: 'text',
					title: 'Hello',
					text: 'This is a text block',
					alignment: 'left'
				},
				{
					id: shortId(),
					type: 'media',
					media: {
						type: 'image',
						url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dzkxMTZlNGp4N3dhdGJwNWtuMWJtd3JpNHl2bTNzemE3YjFvaTFieCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/so8KXAphERsre/giphy.gif',
						altText: 'Image'
					}
				}
			]
		}
	]
};
