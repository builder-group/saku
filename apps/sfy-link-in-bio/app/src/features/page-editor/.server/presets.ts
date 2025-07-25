import { shortId } from '@blgc/utils';
import {
	createId,
	fontMetadataMap,
	getFontHash,
	hexToRgba,
	inheritStyle,
	TId,
	TProductNode,
	TSite,
	type TFontAsset,
	type TFontMetadata,
	type TImageAsset,
	type TSocialLink
} from '@repo/editor';

export function blankPreset(config: TBlankPresetConfig): TSite {
	const { shopId, name, profilePicture, socialLinks, featuredProduct, colors, fonts, radius } =
		config;

	const primaryColor = colors?.primary ?? '#000000';
	const backgroundColor = colors?.background ?? '#FAFAFA';
	const surfaceColor = colors?.surface ?? '#FFFFFF';
	const borderRadius = radius ?? 16;

	const assets: (TFontAsset | TImageAsset)[] = [];

	let profilePictureAssetHashId: TId<'asset'> | undefined;
	if (profilePicture != null) {
		profilePictureAssetHashId = createId('asset');
		assets.push({
			id: profilePictureAssetHashId,
			type: 'image',
			hash: profilePictureAssetHashId,
			contentType: 'image/png',
			storage: {
				type: 'url',
				url: profilePicture
			}
		});
	}

	// Add heading font to assets
	const headingFont = getFontMetadata(fonts?.heading?.family);
	assets.push({
		id: createId('asset'),
		type: 'font',
		hash: getFontHash(headingFont.font),
		contentType: 'font/woff2',
		storage: {
			type: 'url',
			url: `https://fonts.googleapis.com/css2?family=${headingFont.googleFont}&display=swap`
		},
		font: headingFont.font
	});

	// Add body font to assets if different from heading
	const bodyFont = getFontMetadata(fonts?.body?.family);
	if (bodyFont.font.family !== headingFont.font.family) {
		assets.push({
			id: createId('asset'),
			type: 'font',
			hash: getFontHash(bodyFont.font),
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: `https://fonts.googleapis.com/css2?family=${bodyFont.googleFont}&display=swap`
			},
			font: bodyFont.font
		});
	}

	// Add Lora font for creative text elements
	const loraFont = fontMetadataMap.lora;
	assets.push({
		id: createId('asset'),
		type: 'font',
		hash: getFontHash(loraFont.font),
		contentType: 'font/woff2',
		storage: {
			type: 'url',
			url: `https://fonts.googleapis.com/css2?family=${loraFont.googleFont}&display=swap`
		},
		font: loraFont.font
	});

	// Create product node
	let productNode: TProductNode | null = null;
	if (featuredProduct != null) {
		const productImageHashIds: string[] = [];
		for (const image of featuredProduct.images ?? []) {
			const productImageHashId = createId('asset');
			assets.push({
				id: productImageHashId,
				type: 'image',
				hash: productImageHashId,
				contentType: 'image/png',
				storage: {
					type: 'url',
					url: image.url
				},
				altText: image.altText ?? featuredProduct.title
			});
			productImageHashIds.push(productImageHashId);
		}

		productNode = {
			id: createId('node'),
			type: 'product',
			content: {
				product: {
					id: featuredProduct.id,
					title: featuredProduct.title,
					images: productImageHashIds,
					options: featuredProduct.options ?? [],
					variants:
						featuredProduct.variants?.map((variant) => ({
							id: variant.id,
							title: variant.title,
							price: variant.price,
							selectedOptions: variant.selectedOptions ?? []
						})) ?? []
				}
			},
			style: {
				padding: inheritStyle(),
				backgroundColor: inheritStyle(),
				font: inheritStyle(),
				fontSize: inheritStyle(),
				textColor: inheritStyle(),
				borderRadius: inheritStyle(),
				shadow: inheritStyle()
			}
		};
	}

	// Add welcome GIF to assets
	const welcomeAssetHashId = createId('asset');
	assets.push({
		id: welcomeAssetHashId,
		type: 'image',
		hash: welcomeAssetHashId,
		contentType: 'image/gif',
		storage: {
			type: 'url',
			url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExemloNXVzbmtyM3Fremh6b2ZvZXEzeWk4bjdreDYxNDNxamdtcjFhMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CjmvTCZf2U3p09Cn0h/giphy.gif'
		},
		altText: 'Welcome GIF'
	});

	// Create social links array with shop link always first
	const allSocialLinks = [
		{
			id: shortId(),
			provider: 'shopify' as const,
			handle: shopId.replace('.myshopify.com', ''),
			url: `https://${shopId}`
		},
		...(socialLinks?.map((link) => ({
			id: shortId(),
			provider: mapPlatformToProvider(link.platform),
			handle: link.username ?? link.platform,
			url: link.url
		})) ?? [])
	];

	return {
		version: 'v0.0.1',
		assets,
		integrations: [],
		root: {
			type: 'page',
			id: createId('node'),
			children: [
				{
					id: createId('node'),
					type: 'about',
					content: {
						name,
						bio: 'Welcome to your new page! Add a short description about yourself or your brand.',
						profilePicture: profilePictureAssetHashId,
						socialLinks: allSocialLinks
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
					id: createId('node'),
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
					id: createId('node'),
					type: 'text',
					content: {
						text: '## 📙 Or some text\nwith a different font and background color'
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
					id: createId('node'),
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
				...(productNode != null ? [productNode] : []),
				{
					id: createId('node'),
					type: 'media',
					content: {
						media: {
							type: 'image',
							hash: welcomeAssetHashId,
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
				backgroundColor: hexToRgba(backgroundColor),
				children: {
					backgroundColor: hexToRgba(surfaceColor),
					spacing: 24,
					padding: 12,
					font: bodyFont.font,
					fontSize: 16,
					textColor: hexToRgba(primaryColor),
					textAlign: 'center',
					borderRadius: borderRadius,
					shadow: true
				}
			}
		}
	};
}

interface TBlankPresetConfig {
	shopId: string;
	name: string;
	profilePicture?: string;
	socialLinks?: {
		platform: string;
		url: string;
		username?: string;
	}[];
	featuredProduct?: {
		id: string;
		title: string;
		images?: { url: string; altText?: string }[];
		options?: { name: string; values: string[] }[];
		variants?: {
			id: string;
			title: string;
			price: { amount: string; currencyCode: string };
			selectedOptions?: { name: string; value: string }[];
		}[];
	};
	colors?: {
		primary?: string;
		background?: string;
		surface?: string;
	};
	fonts?: {
		heading?: { family?: string };
		body?: { family?: string };
	};
	radius?: number;
}

function getFontMetadata(fontFamily?: string): TFontMetadata {
	if (fontFamily == null) {
		return fontMetadataMap.inter;
	}

	// Try to match font family to available fonts
	const matchedFont = Object.entries(fontMetadataMap).find(
		([_, metadata]) => metadata.font.family.toLowerCase() === fontFamily.toLowerCase()
	);

	return matchedFont ? matchedFont[1] : fontMetadataMap.inter;
}

function mapPlatformToProvider(platform: string): TSocialLink['provider'] {
	const platformMap: Record<string, TSocialLink['provider']> = {
		instagram: 'instagram',
		twitter: 'twitter',
		x: 'twitter',
		youtube: 'youtube',
		tiktok: 'tiktok',
		linkedin: 'linkedin',
		facebook: 'facebook',
		pinterest: 'pinterest'
	};

	return platformMap[platform.toLowerCase()] ?? 'instagram';
}
