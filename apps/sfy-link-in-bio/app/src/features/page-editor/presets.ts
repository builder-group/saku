import { shortId } from '@blgc/utils';
import { hexToRgba, inheritStyle, TSite } from '@repo/editor';

export const blankPreset: TSite = {
	version: 'v0.0.1',
	id: shortId(),
	assets: [
		{
			hash: 'inter-400-normal',
			type: 'font',
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
			},
			font: {
				family: 'Inter',
				weight: 400,
				style: 'normal'
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
				name: 'Your Name',
				bio: 'Welcome to your bio page! Add a short description about yourself or your brand.',
				style: {
					padding: inheritStyle(),
					backgroundColor: hexToRgba('#FFFFFF'),
					font: inheritStyle(),
					fontSize: inheritStyle(),
					textColor: inheritStyle(),
					textAlign: 'center',
					borderRadius: inheritStyle(),
					shadow: inheritStyle()
				}
			},
			{
				id: shortId(),
				type: 'link',
				url: 'https://your-store.myshopify.com',
				meta: {
					title: 'Visit My Store',
					description: 'Shop our latest products'
				},
				style: {
					padding: inheritStyle(),
					backgroundColor: hexToRgba('#F3F3F3'),
					font: inheritStyle(),
					fontSize: inheritStyle(),
					textColor: inheritStyle(),
					textAlign: 'center',
					borderRadius: inheritStyle(),
					shadow: inheritStyle()
				}
			}
		],
		style: {
			backgroundColor: hexToRgba('#FFFFFF'),
			children: {
				backgroundColor: hexToRgba('#FFFFFF'),
				spacing: 16,
				padding: 16,
				font: {
					family: 'Inter',
					weight: 400,
					style: 'normal'
				},
				fontSize: 16,
				textColor: hexToRgba('#2F4F4F'),
				textAlign: 'center',
				borderRadius: 12,
				shadow: false
			}
		}
	}
};

export const kangarooPreset: TSite = {
	version: 'v0.0.1',
	id: shortId(),
	assets: [
		{
			hash: 'inter-400-normal',
			type: 'font',
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
			},
			font: {
				family: 'Inter',
				weight: 400,
				style: 'normal'
			}
		},
		{
			hash: 'playfair-400-normal',
			type: 'font',
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'
			},
			font: {
				family: 'Playfair Display',
				weight: 400,
				style: 'normal'
			}
		},
		{
			hash: 'lora-400-normal',
			type: 'font',
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap'
			},
			font: {
				family: 'Lora',
				weight: 400,
				style: 'normal'
			}
		},
		{
			hash: 'kangaroo-profile-image',
			type: 'image',
			contentType: 'image/gif',
			storage: {
				type: 'url',
				url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dzkxMTZlNGp4N3dhdGJwNWtuMWJtd3JpNHl2bTNzemE3YjFvaTFieCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/so8KXAphERsre/giphy.gif'
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
				profilePicture: 'kangaroo-profile-image',
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
					padding: inheritStyle(),
					backgroundColor: hexToRgba('#FFFFFF'),
					font: {
						family: 'Playfair Display',
						weight: 400,
						style: 'normal'
					},
					fontSize: inheritStyle(),
					textColor: inheritStyle(),
					textAlign: 'center',
					borderRadius: inheritStyle(),
					shadow: inheritStyle()
				}
			},
			{
				id: shortId(),
				type: 'link',
				url: 'https://australianwildlife.org',
				meta: {
					title: 'Australian Wildlife Foundation',
					description: 'Supporting native Australian animals and their habitats'
				},
				fetchedMeta: {
					title: 'Australian Wildlife Foundation',
					description: 'Supporting native Australian animals and their habitats'
				},
				style: {
					padding: inheritStyle(),
					backgroundColor: hexToRgba('#8FBC8F'),
					font: inheritStyle(),
					fontSize: inheritStyle(),
					textColor: hexToRgba('#FFFFFF'),
					textAlign: 'center',
					borderRadius: inheritStyle(),
					shadow: inheritStyle()
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
					backgroundColor: hexToRgba('#D2B48C'),
					font: inheritStyle(),
					fontSize: inheritStyle(),
					textColor: hexToRgba('#8B4513'),
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
					hash: 'kangaroo-profile-image',
					altText: 'Adorable kangaroo hopping around'
				},
				style: {
					padding: 16,
					backgroundColor: hexToRgba('#F0F8FF'),
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
					backgroundColor: hexToRgba('#F5FFFA'),
					font: {
						family: 'Lora',
						weight: 400,
						style: 'normal'
					},
					fontSize: 14,
					textColor: hexToRgba('#556B2F'),
					textAlign: 'left',
					borderRadius: 12,
					shadow: inheritStyle()
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
					padding: inheritStyle(),
					backgroundColor: hexToRgba('#DEB887'),
					font: inheritStyle(),
					fontSize: inheritStyle(),
					textColor: hexToRgba('#8B4513'),
					textAlign: 'center',
					borderRadius: inheritStyle(),
					shadow: false
				}
			}
		],
		style: {
			backgroundColor: hexToRgba('#F5F5DC'),
			children: {
				backgroundColor: hexToRgba('#FFFFFF'),
				spacing: 16,
				padding: 16,
				font: {
					family: 'Inter',
					weight: 400,
					style: 'normal'
				},
				fontSize: 16,
				textColor: hexToRgba('#2F4F4F'),
				textAlign: 'center',
				borderRadius: 12,
				shadow: true
			}
		}
	}
};
