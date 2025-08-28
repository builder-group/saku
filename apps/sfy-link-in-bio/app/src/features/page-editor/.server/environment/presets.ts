import { shortId } from '@blgc/utils';
import {
	createId,
	fontMetadataMap,
	getFontHash,
	hexToRgba,
	TId,
	tokenRef,
	TProductNode,
	TSite,
	type TFontAsset,
	type TFontMetadata,
	type TImageAsset,
	type TSocialLink
} from '@repo/editor';
import { createTokensFromStyleTemplate, type TStyleTemplate } from '@/features/page-editor';
import { createHandleFromShop } from '@/lib';

export function blankPreset(config: TBlankPresetConfig): TSite {
	const { shopId, name, profilePicture, socialLinks, featuredProduct, styleTemplate } = config;

	// Generate tokens from the style template
	const tokens = createTokensFromStyleTemplate(styleTemplate);

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

	// Add template font to assets
	const templateFontFamily = styleTemplate.typography.fontFamily;
	const templateFont = getFontMetadata(templateFontFamily);
	assets.push({
		id: createId('asset'),
		type: 'font',
		hash: getFontHash(templateFont.font),
		contentType: 'font/woff2',
		storage: {
			type: 'url',
			url: `https://fonts.googleapis.com/css2?family=${templateFont.googleFont}&display=swap`
		},
		font: templateFont.font
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
			autoLayout: {
				horizontalPadding: tokenRef(),
				verticalPadding: tokenRef(),
				horizontalGap: tokenRef(),
				verticalGap: tokenRef()
			},
			appearance: {
				visible: true,
				opacity: tokenRef(),
				borderRadius: tokenRef()
			},
			fill: tokenRef(),
			stroke: tokenRef(),
			shadow: tokenRef(),
			text: {
				appearance: {
					visible: true,
					opacity: tokenRef()
				},
				typography: {
					font: tokenRef(),
					fontSize: tokenRef(),
					textAlignHorizontal: 'start',
					textAlignVertical: tokenRef(),
					lineHeight: tokenRef(),
					letterSpacing: tokenRef()
				},
				fill: tokenRef(),
				stroke: tokenRef(),
				shadow: tokenRef()
			},
			button: {
				appearance: {
					visible: true,
					opacity: tokenRef(),
					borderRadius: tokenRef()
				},
				fill: tokenRef(),
				stroke: tokenRef(),
				shadow: tokenRef(),
				text: {
					appearance: {
						visible: true,
						opacity: tokenRef()
					},
					typography: {
						font: tokenRef(),
						fontSize: tokenRef(),
						textAlignHorizontal: tokenRef(),
						textAlignVertical: tokenRef(),
						lineHeight: tokenRef(),
						letterSpacing: tokenRef()
					},
					fill: tokenRef(),
					stroke: tokenRef(),
					shadow: tokenRef()
				}
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
			handle: createHandleFromShop(shopId),
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
			content: {
				metadata: {}
			},
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
					autoLayout: {
						horizontalPadding: tokenRef(),
						verticalPadding: tokenRef(),
						verticalGap: tokenRef()
					},
					appearance: {
						visible: true,
						opacity: tokenRef(),
						borderRadius: 0
					},
					fill: null,
					stroke: null,
					shadow: null,
					text: {
						appearance: {
							visible: true,
							opacity: tokenRef()
						},
						typography: {
							font: tokenRef(),
							fontSize: tokenRef(),
							textAlignHorizontal: 'center',
							textAlignVertical: tokenRef(),
							lineHeight: tokenRef(),
							letterSpacing: tokenRef()
						},
						fill: tokenRef(),
						stroke: tokenRef(),
						shadow: tokenRef()
					}
				},
				{
					id: createId('node'),
					type: 'link',
					content: {
						url: `https://${shopId}`,
						variant: {
							type: 'default',
							userTitle: '🛒 Visit our Shopify store'
						}
					},
					autoLayout: {
						horizontalPadding: tokenRef(),
						verticalPadding: tokenRef(),
						horizontalGap: tokenRef(),
						verticalGap: tokenRef()
					},
					appearance: {
						visible: true,
						opacity: tokenRef(),
						borderRadius: tokenRef()
					},
					fill: tokenRef(),
					stroke: tokenRef(),
					shadow: tokenRef(),
					text: {
						appearance: {
							visible: true,
							opacity: tokenRef()
						},
						typography: {
							font: tokenRef(),
							fontSize: tokenRef(),
							textAlignHorizontal: tokenRef(),
							textAlignVertical: tokenRef(),
							lineHeight: tokenRef(),
							letterSpacing: tokenRef()
						},
						fill: tokenRef(),
						stroke: tokenRef(),
						shadow: tokenRef()
					}
				},
				...(productNode != null ? [productNode] : []),
				{
					id: createId('node'),
					type: 'text',
					content: {
						text: '✨ Thanks for visiting!'
					},
					autoLayout: {
						horizontalPadding: tokenRef(),
						verticalPadding: tokenRef()
					},
					appearance: {
						visible: true,
						opacity: tokenRef(),
						borderRadius: tokenRef()
					},
					fill: tokenRef(),
					stroke: tokenRef(),
					shadow: tokenRef(),
					text: {
						appearance: {
							visible: true,
							opacity: tokenRef()
						},
						typography: {
							font: tokenRef(),
							fontSize: tokenRef(),
							textAlignHorizontal: tokenRef(),
							textAlignVertical: tokenRef(),
							lineHeight: tokenRef(),
							letterSpacing: tokenRef()
						},
						fill: tokenRef(),
						stroke: tokenRef(),
						shadow: tokenRef()
					}
				},
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
					autoLayout: {
						horizontalPadding: 0,
						verticalPadding: 0
					},
					appearance: {
						visible: true,
						opacity: tokenRef(),
						borderRadius: tokenRef()
					},
					fill: tokenRef(),
					stroke: tokenRef(),
					shadow: tokenRef()
				}
			],
			autoLayout: {
				horizontalPadding: 24,
				verticalPadding: 48,
				verticalGap: 24
			},
			appearance: {
				visible: true,
				opacity: 1
			},
			fill: {
				paint: {
					type: 'solid',
					color: hexToRgba(styleTemplate.colors.background)
				},
				opacity: 1
			}
		},
		tokens
	};
}

interface TBlankPresetConfig {
	shopId: string;
	name: string;
	styleTemplate: TStyleTemplate;
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
