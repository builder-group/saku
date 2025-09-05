import { shortId } from '@blgc/utils';
import {
	createId,
	createTokensFromTheme,
	fontMetadataMap,
	getFontHash,
	hexToRgba,
	TId,
	TProductNode,
	TSite,
	TTheme,
	type TFontAsset,
	type TFontMetadata,
	type TImageAsset,
	type TSocialLink
} from '@repo/editor';
import {
	aboutNodeMetadata,
	linkNodeMetadata,
	mediaNodeMetadata,
	productNodeMetadata,
	textNodeMetadata
} from '@/features/page-editor';
import { createHandleFromShop } from '@/lib';

export function blankPreset(config: TBlankPresetConfig): TSite {
	const { shopId, name, profilePicture, socialLinks, featuredProduct, theme } = config;
	const tokens = createTokensFromTheme(theme);

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

	// Add theme fonts to assets
	const themeHeadingTextFontFamily = theme.typography.heading.fontFamily;
	const themeHeadingTextFont = getFontMetadata(themeHeadingTextFontFamily);
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
	const themeTextFontFamily = theme.typography.text.fontFamily;
	const themeTextFont = getFontMetadata(themeTextFontFamily);
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
			id: createId('node'),
			type: 'product',
			...productNodeMetadata.default,
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
				type: 'default'
			},
			metadata: {},
			children: [
				{
					id: createId('node'),
					type: 'about',
					...aboutNodeMetadata.default,
					content: {
						type: 'default',
						name,
						bio: 'Welcome to your new page! Add a short description about yourself or your brand.',
						profilePicture: profilePictureAssetHashId,
						socialLinks: allSocialLinks
					}
				},
				{
					id: createId('node'),
					type: 'link',
					...linkNodeMetadata.default,
					content: {
						type: 'single',
						url: `https://${shopId}`,
						userTitle: '🛒 Visit our Shopify store'
					}
				},
				...(productNode != null ? [productNode] : []),
				{
					id: createId('node'),
					type: 'text',
					...textNodeMetadata.default,
					content: {
						type: 'default',
						text: { type: 'markdown', value: '✨ Thanks for visiting!' }
					}
				},
				{
					id: createId('node'),
					type: 'media',
					...mediaNodeMetadata.default,
					content: {
						type: 'image',
						media: {
							hash: gifAssetHashId,
							altText: 'Welcome GIF'
						}
					}
				}
			],
			autoLayout: {
				horizontalPadding: 24,
				verticalPadding: 48,
				verticalGap: 24,
				horizontalGap: undefined
			},
			appearance: {
				visible: true,
				opacity: 1,
				borderRadius: undefined
			},
			fill: {
				paint: {
					type: 'solid',
					color: hexToRgba(theme.color.base200)
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
	theme: TTheme;
	profilePicture?: string;
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

function getFontMetadata(fontFamily?: string): TFontMetadata {
	if (fontFamily == null) {
		return fontMetadataMap.inter;
	}

	// Try to match font family to available fonts
	const matchedFont = Object.entries(fontMetadataMap).find(
		([, metadata]) => metadata.font.family.toLowerCase() === fontFamily.toLowerCase()
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
