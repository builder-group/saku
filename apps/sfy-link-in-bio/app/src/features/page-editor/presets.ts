import { shortId } from '@blgc/utils';
import { hexToRgba, inheritStyle, TSite } from '@repo/editor';
import { createDisplayNameFromShop } from '@/lib';

export function blankPreset(config: TBlankPresetConfig): TSite {
	const { shopId } = config;

	return {
		version: 'v0.0.1',
		assets: [
			{
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
				},
				hash: 'inter-400-normal'
			},
			{
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
				},
				hash: 'lora-400-normal'
			},
			{
				hash: 'welcome-gif',
				type: 'image',
				contentType: 'image/gif',
				storage: {
					type: 'url',
					url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExemloNXVzbmtyM3Fremh6b2ZvZXEzeWk4bjdreDYxNDNxamdtcjFhMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CjmvTCZf2U3p09Cn0h/giphy.gif'
				},
				altText: 'Welcome GIF'
			}
		],
		root: {
			type: 'page',
			id: shortId(),
			children: [
				{
					id: shortId(),
					type: 'about',
					content: {
						name: createDisplayNameFromShop(shopId),
						bio: 'Welcome to your new page! Add a short description about yourself or your brand.',
						profilePicture: undefined,
						socialLinks: [
							{
								id: shortId(),
								provider: 'shopify',
								handle: shopId.replace('.myshopify.com', ''),
								url: `https://${shopId}`
							}
						]
					},
					style: {
						padding: inheritStyle(),
						backgroundColor: { r: 255, g: 255, b: 255, a: 0 },
						font: inheritStyle(),
						fontSize: inheritStyle(),
						textColor: inheritStyle(),
						textAlign: 'center',
						borderRadius: inheritStyle(),
						shadow: false
					}
				},
				{
					id: shortId(),
					type: 'link',
					content: {
						url: `https://${shopId}`,
						userMetadata: {
							title: '🛒 Add a link to your Shopify store'
						}
					},
					style: {
						padding: inheritStyle(),
						backgroundColor: inheritStyle(),
						font: inheritStyle(),
						fontSize: inheritStyle(),
						textColor: inheritStyle(),
						textAlign: inheritStyle(),
						borderRadius: inheritStyle(),
						shadow: inheritStyle()
					}
				},
				{
					id: shortId(),
					type: 'text',
					content: {
						title: '📙 Or some text',
						text: 'with a different font and background color'
					},
					style: {
						padding: inheritStyle(),
						backgroundColor: hexToRgba('#E6EDFF'),
						font: {
							family: 'Lora',
							weight: 400,
							style: 'normal'
						},
						fontSize: inheritStyle(),
						textColor: inheritStyle(),
						textAlign: inheritStyle(),
						borderRadius: 0,
						shadow: inheritStyle()
					}
				},
				{
					id: shortId(),
					type: 'text',
					content: {
						text: '🔮 Let your imagination flow'
					},
					style: {
						padding: inheritStyle(),
						backgroundColor: hexToRgba('#FAF5FF'),
						font: inheritStyle(),
						fontSize: 24,
						textColor: hexToRgba('#E879F9'),
						textAlign: inheritStyle(),
						borderRadius: 999,
						shadow: inheritStyle()
					}
				},
				{
					id: shortId(),
					type: 'media',
					content: {
						media: {
							type: 'image',
							hash: 'welcome-gif',
							altText: 'Welcome GIF'
						}
					},
					style: {
						padding: 0,
						backgroundColor: inheritStyle(),
						borderRadius: inheritStyle(),
						shadow: inheritStyle()
					}
				}
			],
			style: {
				backgroundColor: hexToRgba('#FAFAFA'),
				children: {
					backgroundColor: hexToRgba('#FFFFFF'),
					spacing: 24,
					padding: 12,
					font: {
						family: 'Inter',
						weight: 400,
						style: 'normal'
					},
					fontSize: 16,
					textColor: hexToRgba('#222222'),
					textAlign: 'center',
					borderRadius: 16,
					shadow: true
				}
			}
		}
	};
}

interface TBlankPresetConfig {
	shopId: string;
}
