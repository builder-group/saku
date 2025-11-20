import { notEmpty, shortId } from '@blgc/utils';
import {
	aboutNodeMetadata,
	contactMetadataMap,
	createId,
	createThemeTokens,
	fontMetadataMap,
	getFontHash,
	getFontMetadataByFamily,
	getSocialContactMetadata,
	guessMimeType,
	linkNodeMetadata,
	mediaNodeMetadata,
	pageNodeMetadata,
	productNodeMetadata,
	TClassicAboutNodeBundle,
	TClassicLinkNodeBundle,
	TClassicMediaNodeBundle,
	TContactLink,
	textNodeMetadata,
	TId,
	toImageContentType,
	TProductNode,
	TRichTextNodeBundle,
	TSite,
	TTheme,
	type TFontAsset,
	type TImageAsset
} from '@repo/editor';
import { createHandleFromShop } from '@/lib';

export function blankPreset(config: TBlankPresetConfig): TSite {
	const { shopId, title, avatar, socialLinks, featuredProduct, theme } = config;

	const assets: (TFontAsset | TImageAsset)[] = [];

	let avatarAssetHashId: TId<'asset'> | undefined;
	if (avatar != null) {
		avatarAssetHashId = createId('asset');
		assets.push({
			id: avatarAssetHashId,
			type: 'image',
			hash: avatarAssetHashId,
			contentType: 'image/png',
			storage: {
				type: 'url',
				url: avatar
			}
		});
	}

	// Add theme fonts to assets
	if (theme != null) {
		const themeDisplayFont =
			getFontMetadataByFamily(theme.typography.display.fontFamily) ?? fontMetadataMap.inter;
		assets.push({
			id: createId('asset'),
			type: 'font',
			hash: getFontHash(themeDisplayFont.font),
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: `https://fonts.googleapis.com/css2?family=${themeDisplayFont.googleFont}&display=swap`
			},
			font: themeDisplayFont.font
		});
		const themeBodyFont =
			getFontMetadataByFamily(theme.typography.body.fontFamily) ?? fontMetadataMap.inter;
		assets.push({
			id: createId('asset'),
			type: 'font',
			hash: getFontHash(themeBodyFont.font),
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: `https://fonts.googleapis.com/css2?family=${themeBodyFont.googleFont}&display=swap`
			},
			font: themeBodyFont.font
		});
	}

	// Create product node
	let productNode: TProductNode | null = null;
	if (featuredProduct != null) {
		const productImageHashIds: string[] = [];
		for (const image of featuredProduct.images) {
			const contentType = toImageContentType(guessMimeType(image.url));
			if (contentType == null) {
				continue;
			}
			const productImageHashId = createId('asset');
			assets.push({
				id: productImageHashId,
				type: 'image',
				hash: productImageHashId,
				contentType,
				storage: {
					type: 'url',
					url: image.url
				},
				altText: image.altText ?? featuredProduct.title
			});
			productImageHashIds.push(productImageHashId);
		}

		productNode = {
			...productNodeMetadata.bundleMap.classic,
			id: createId('node'),
			content: {
				type: 'single',
				cta: {
					visible: true,
					label: 'Buy Now',
					action: { type: 'product-direct-buy' }
				},
				variants: {
					visible: true
				},
				product: {
					id: featuredProduct.id,
					title: featuredProduct.title,
					description: { type: 'html', value: featuredProduct.descriptionHtml },
					images: productImageHashIds,
					options: featuredProduct.options,
					variants: featuredProduct.variants.map((variant) => {
						let variantImageHashId: TId<'asset'> | undefined;
						if (variant.image != null) {
							const contentType = toImageContentType(guessMimeType(variant.image.url));
							if (contentType != null) {
								variantImageHashId = createId('asset');
								assets.push({
									id: variantImageHashId,
									type: 'image',
									hash: variantImageHashId,
									contentType: 'image/png',
									storage: {
										type: 'url',
										url: variant.image.url
									},
									altText: variant.image.altText ?? variant.title
								});
							}
						}

						return {
							id: variant.id,
							title: variant.title,
							image: variantImageHashId,
							price: variant.price,
							selectedOptions: variant.selectedOptions
						};
					})
				},
				overrides: {}
			}
		};
	}

	// Add GIF to assets
	const gifAssetHashId = createId('asset');
	assets.push({
		id: gifAssetHashId,
		type: 'image',
		hash: gifAssetHashId,
		contentType: 'image/gif',
		storage: {
			type: 'url',
			url: 'https://media1.tenor.com/m/k5cZgAKH5jAAAAAd/bunny-rabbit.gif'
		},
		altText: 'Vibe Rabbit GIF'
	});

	const storeHandle = createHandleFromShop(shopId);

	return {
		version: 'v0.0.4',
		assets,
		integrations: [],
		root: {
			...pageNodeMetadata.bundleMap.classic,
			id: createId('node'),
			children: [
				{
					...aboutNodeMetadata.bundleMap.classic,
					id: createId('node'),
					content: {
						type: 'basic',
						title,
						description:
							'Welcome to your new page! Add a short description about yourself or your brand.',
						avatar: avatarAssetHashId,
						contactLinks: [
							{
								id: shortId(),
								action: {
									type: 'social',
									provider: 'shopify',
									handle: storeHandle,
									url: contactMetadataMap['social.shopify'].getUrl(storeHandle)
								},
								altText: contactMetadataMap['social.shopify'].getAltText(storeHandle)
							},
							...(socialLinks
								?.map((link) => {
									const contactMetadata = getSocialContactMetadata(link.platform);
									if (contactMetadata == null) {
										return null;
									}
									const handle = contactMetadata.getHandle(link.url);
									if (handle == null) {
										return null;
									}
									return {
										id: shortId(),
										action: {
											type: 'social',
											provider: contactMetadata.provider,
											handle,
											url: contactMetadata.getUrl(handle)
										},
										altText: contactMetadata.getAltText(handle)
									} satisfies TContactLink;
								})
								.filter(notEmpty) ?? [])
						]
					}
				} satisfies TClassicAboutNodeBundle,
				{
					...linkNodeMetadata.bundleMap.classic,
					id: createId('node'),
					content: {
						type: 'basic',
						url: `https://${shopId}`,
						metadata: {},
						overrides: {
							title: '🛒 Visit our Shopify store'
						}
					}
				} satisfies TClassicLinkNodeBundle,
				...(productNode != null ? [productNode] : []),
				{
					...textNodeMetadata.bundleMap.rich,
					id: createId('node'),
					content: {
						type: 'rich',
						text: { type: 'markdown', value: '✨ Thanks for visiting!' }
					}
				} satisfies TRichTextNodeBundle,
				{
					...mediaNodeMetadata.bundleMap.classic,
					id: createId('node'),
					content: {
						type: 'single',
						media: {
							type: 'image',
							hash: gifAssetHashId,
							altText: 'Welcome GIF'
						}
					}
				} satisfies TClassicMediaNodeBundle
			]
		},
		tokens: theme != null ? createThemeTokens(theme) : []
	};
}

interface TBlankPresetConfig {
	shopId: string;
	title: string;
	theme?: TTheme;
	avatar?: string;
	socialLinks?: {
		platform: string;
		url: string;
		username?: string;
	}[];
	featuredProduct?: {
		id: string;
		title: string;
		descriptionHtml: string;
		images: {
			url: string;
			altText?: string;
		}[];
		options: { name: string; values: string[] }[];
		variants: {
			id: string;
			title: string;
			price: { amount: string; currencyCode: string };
			image?: {
				url: string;
				altText?: string;
			};
			selectedOptions: { name: string; value: string }[];
		}[];
	};
}
