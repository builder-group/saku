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
	linkNodeMetadata,
	mediaNodeMetadata,
	productNodeMetadata,
	TClassicAboutNodeBundle,
	TClassicLinkNodeBundle,
	TClassicMediaNodeBundle,
	TContactIcon,
	textNodeMetadata,
	TId,
	tokenRef,
	TProductNode,
	TRichTextNodeBundle,
	TSite,
	TTheme,
	type TFontAsset,
	type TImageAsset
} from '@repo/editor';
import { createHandleFromShop } from '@/lib';

export function blankPreset(config: TBlankPresetConfig): TSite {
	const { shopId, name, avatar, socialLinks, featuredProduct, theme } = config;

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
		const themeHeadingTextFont =
			getFontMetadataByFamily(theme.typography.heading.fontFamily) ?? fontMetadataMap.inter;
		assets.push({
			id: createId('asset'),
			type: 'font',
			hash: getFontHash(themeHeadingTextFont.font),
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: `https://fonts.googleapis.com/css2?family=${themeHeadingTextFont.googleFont}&display=swap`
			},
			font: themeHeadingTextFont.font
		});
		const themeTextFont =
			getFontMetadataByFamily(theme.typography.text.fontFamily) ?? fontMetadataMap.inter;
		assets.push({
			id: createId('asset'),
			type: 'font',
			hash: getFontHash(themeTextFont.font),
			contentType: 'font/woff2',
			storage: {
				type: 'url',
				url: `https://fonts.googleapis.com/css2?family=${themeTextFont.googleFont}&display=swap`
			},
			font: themeTextFont.font
		});
	}

	// Create product node
	let productNode: TProductNode | null = null;
	if (featuredProduct != null) {
		const productImageHashIds: string[] = [];
		for (const image of featuredProduct.images) {
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
			...productNodeMetadata.bundleMap.classic,
			id: createId('node'),
			content: {
				type: 'single',
				product: {
					id: featuredProduct.id,
					title: featuredProduct.title,
					description: { type: 'html', value: featuredProduct.descriptionHtml },
					images: productImageHashIds,
					options: featuredProduct.options,
					variants: featuredProduct.variants.map((variant) => {
						let variantImageHashId: TId<'asset'> | undefined;
						if (variant.image != null) {
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

						return {
							id: variant.id,
							title: variant.title,
							image: variantImageHashId,
							price: variant.price,
							selectedOptions: variant.selectedOptions
						};
					})
				}
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

	// Create contact icons array with shop link always first
	const storeHandle = createHandleFromShop(shopId);
	const contactIcons: TContactIcon[] = [
		{
			id: shortId(),
			action: {
				type: 'social',
				provider: 'shopify',
				handle: storeHandle,
				url: contactMetadataMap['social.shopify'].getUrl(storeHandle)
			},
			title: contactMetadataMap['social.shopify'].getTitle(storeHandle)
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
					title: contactMetadata.getTitle(handle)
				} satisfies TContactIcon;
			})
			.filter(notEmpty) ?? [])
	];

	return {
		version: 'v0.0.1',
		assets,
		integrations: [],
		root: {
			type: 'page',
			bundleType: 'classic',
			id: createId('node'),
			metadata: {},
			hasWatermark: true,
			children: [
				{
					...aboutNodeMetadata.bundleMap.classic,
					id: createId('node'),
					content: {
						type: 'basic',
						name,
						bio: 'Welcome to your new page! Add a short description about yourself or your brand.',
						avatar: avatarAssetHashId,
						contactIcons: contactIcons
					}
				} satisfies TClassicAboutNodeBundle,
				{
					...linkNodeMetadata.bundleMap.classic,
					id: createId('node'),
					content: {
						type: 'basic',
						url: `https://${shopId}`,
						userTitle: '🛒 Visit our Shopify store'
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
			],
			autoLayout: {
				horizontalPadding: 24,
				verticalPadding: 48,
				verticalGap: tokenRef('spacing.gap', 'number'),
				horizontalGap: null
			},
			appearance: {
				visible: true,
				opacity: 1,
				borderRadius: null
			},
			fill: {
				paint: tokenRef('paint.base200', 'paint'),
				opacity: 1
			}
		},
		tokens: theme != null ? createThemeTokens(theme) : []
	};
}

interface TBlankPresetConfig {
	shopId: string;
	name: string;
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
