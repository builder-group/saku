import { shortId } from '@blgc/utils';
import { TSite } from './types';

export const kangarooPreset: TSite = {
	version: 'v0.0.1',
	id: shortId(),
	assets: [
		{
			id: 'font-inter',
			type: 'font',
			contentType: 'font/woff2',
			content: {
				type: 'url',
				url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
			}
		},
		{
			id: 'font-playfairDisplay',
			type: 'font',
			contentType: 'font/woff2',
			content: {
				type: 'url',
				url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'
			}
		},
		{
			id: 'font-lora',
			type: 'font',
			contentType: 'font/woff2',
			content: {
				type: 'url',
				url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap'
			}
		}
	],
	root: {
		type: 'page',
		id: shortId(),
		children: [
			{
				id: shortId(),
				type: 'about',
				name: 'Kangaroo Joey',
				bio: '🦘 Hopping through life one bounce at a time! Australian wildlife enthusiast and adventure seeker.',
				media: {
					type: 'image',
					url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dzkxMTZlNGp4N3dhdGJwNWtuMWJtd3JpNHl2bTNzemE3YjFvaTFieCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/so8KXAphERsre/giphy.gif',
					altText: 'Cute kangaroo GIF'
				},
				socialLinks: [
					{
						id: shortId(),
						provider: 'instagram',
						handle: 'kangaroo_joey',
						url: 'https://instagram.com/kangaroo_joey'
					},
					{
						id: shortId(),
						provider: 'youtube',
						handle: 'WildlifeAdventures',
						url: 'https://youtube.com/@WildlifeAdventures'
					}
				],
				style: {
					padding: 'inherit',
					margin: 'inherit',
					backgroundColor: '#FFFFFF', // Card style with white background
					fontFamily: '"Playfair Display", serif',
					fontSize: 'inherit',
					textColor: 'inherit',
					textAlign: 'center',
					borderRadius: 'inherit',
					shadow: 'inherit'
				}
			},
			{
				id: shortId(),
				type: 'link',
				url: 'https://australianwildlife.org',
				meta: {
					title: 'Australian Wildlife Foundation',
					description: 'Supporting native Australian animals and their habitats',
					faviconUrl:
						'https://www.australianwildlife.org/themes/custom/dvb/assets/images/favicon.svg'
				},
				fetchedMeta: {
					title: 'Australian Wildlife Foundation',
					description: 'Supporting native Australian animals and their habitats',
					faviconUrl:
						'https://www.australianwildlife.org/themes/custom/dvb/assets/images/favicon.svg'
				},
				style: {
					padding: 'inherit',
					margin: 'inherit',
					backgroundColor: '#8FBC8F', // Forest green
					fontFamily: 'inherit',
					fontSize: 'inherit',
					textColor: '#FFFFFF',
					textAlign: 'center',
					borderRadius: 'inherit',
					shadow: 'inherit'
				}
			},
			{
				id: shortId(),
				type: 'link',
				url: 'https://shop.zooaustralia.com',
				meta: {
					title: '🦘 Kangaroo Merch Store',
					description: 'Eco-friendly kangaroo themed merchandise'
				},
				style: {
					padding: 20,
					margin: 'inherit',
					backgroundColor: '#D2B48C', // Tan
					fontFamily: 'inherit',
					fontSize: 'inherit',
					textColor: '#8B4513', // Saddle brown
					textAlign: 'center',
					borderRadius: 16,
					shadow: true
				}
			},
			{
				id: shortId(),
				type: 'media',
				media: {
					type: 'image',
					url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dzkxMTZlNGp4N3dhdGJwNWtuMWJtd3JpNHl2bTNzemE3YjFvaTFieCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/so8KXAphERsre/giphy.gif',
					altText: 'Adorable kangaroo hopping around'
				},
				style: {
					padding: 16,
					margin: 'inherit',
					backgroundColor: '#F0F8FF', // Light blue background for media card
					borderRadius: 24,
					shadow: true
				}
			},
			{
				id: shortId(),
				type: 'text',
				title: 'Did you know?',
				text: "Kangaroos can't walk backwards! They use their powerful tail for balance and can hop up to 40 mph. Baby kangaroos are only 2 cm when born! 🦘✨",
				style: {
					padding: 16,
					margin: 'inherit',
					backgroundColor: '#F5FFFA', // Mint cream background for text card
					fontFamily: 'Lora, serif',
					fontSize: 14,
					textColor: '#556B2F', // Dark olive green
					textAlign: 'left',
					borderRadius: 12,
					shadow: 'inherit'
				}
			},
			{
				id: shortId(),
				type: 'link',
				url: 'mailto:joey@kangaroolife.com',
				meta: {
					title: '📧 Get in Touch',
					description: 'Email me for wildlife photography collaborations'
				},
				style: {
					padding: 'inherit',
					margin: 'inherit',
					backgroundColor: '#DEB887', // Burlywood
					fontFamily: 'inherit',
					fontSize: 'inherit',
					textColor: '#8B4513',
					textAlign: 'center',
					borderRadius: 'inherit',
					shadow: false
				}
			}
		],
		style: {
			backgroundColor: '#F5F5DC', // Beige - natural sandy color (page background)
			children: {
				backgroundColor: '#FFFFFF', // White card backgrounds for children by default
				spacing: 16,
				padding: 16,
				margin: 8,
				fontFamily: 'Inter',
				fontSize: 16,
				textColor: '#2F4F4F', // Dark slate gray
				textAlign: 'center',
				borderRadius: 12,
				shadow: true
			}
		}
	}
};
