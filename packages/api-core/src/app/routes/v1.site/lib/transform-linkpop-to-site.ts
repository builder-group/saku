import { shortId } from '@blgc/utils';
import {
	aboutNodeMetadata,
	createId,
	createTokensFromTheme,
	cssRgbaToHex,
	cssRgbaToRgba,
	fontMetadataMap,
	getFontHash,
	getFontMetadataByFamily,
	getSocialContactMetadata,
	hexToRgba,
	linkNodeMetadata,
	TAboutNode,
	TAsset,
	TAssetHash,
	TContactIcon,
	textNodeMetadata,
	TFontAsset,
	themes,
	TImageAsset,
	TLinkNode,
	TPaint,
	TSite,
	TTextNode,
	TTheme
} from '@repo/editor';
import { extractYouTubeVideoId } from './extract-youtube-video-id';
import { TLinkPopData } from './parse-linkpop-html';

export function transformLinkpopToSite(linkpopData: TLinkPopData): TSite {
	const children: (TAboutNode | TLinkNode | TTextNode)[] = [];
	const assets: TAsset[] = [];
	const page = linkpopData.page;

	// Create font asset for primary font
	const primaryFont = page?.themeSettings?.primaryFont ?? 'Inter';
	const fontAsset = createFontAsset(primaryFont);
	assets.push(fontAsset);

	// Handle background image if present
	let backgroundPaint: TPaint;
	if (
		page?.themeSettings?.backgroundStyle === 'image' &&
		page?.themeSettings?.backgroundImage?.url != null
	) {
		const backgroundImageAsset = createImageAssetFromUrl(page.themeSettings.backgroundImage.url);
		assets.push(backgroundImageAsset);
		backgroundPaint = {
			type: 'image',
			hash: backgroundImageAsset.hash
		};
	} else {
		backgroundPaint = {
			type: 'solid',
			color: cssRgbaToRgba(page?.themeSettings?.backgroundColor) ?? hexToRgba('#FFFFFF')
		};
	}

	const borderRadius = getBorderRadiusFromShape(page?.themeSettings?.linkCardShape);

	// Create about node if we have profile data
	if (page?.title != null || page?.bio != null) {
		// Create image asset for profile picture if it exists
		let profilePictureHash: string | undefined;
		if (page?.media?.url != null) {
			const imageAsset = createImageAssetFromUrl(page.media.url);
			assets.push(imageAsset);
			profilePictureHash = imageAsset.hash;
		}

		const aboutNode: TAboutNode = {
			id: createId('node'),
			type: 'about',
			...aboutNodeMetadata.default,
			content: {
				type: 'default',
				name: page.title ?? 'Your Name',
				bio: page.bio,
				profilePicture: profilePictureHash,
				contactIcons: transformSocialLinks(page.socialMediaAccounts ?? [])
			},
			textXl: {
				...aboutNodeMetadata.default.textXl,
				fill: {
					paint: {
						type: 'solid',
						color: cssRgbaToRgba(page?.themeSettings?.fontColor) ?? hexToRgba('#000000')
					},
					opacity: 1
				}
			},
			text: {
				...textNodeMetadata.default.text,
				fill: {
					paint: {
						type: 'solid',
						color: cssRgbaToRgba(page?.themeSettings?.fontColor) ?? hexToRgba('#000000')
					},
					opacity: 1
				}
			},
			image: {
				...aboutNodeMetadata.default.image,
				appearance: {
					...aboutNodeMetadata.default.image.appearance,
					borderRadius: 999
				}
			}
		};
		children.push(aboutNode);
	}

	// Transform links and text nodes
	if (page?.links != null && page.links.length > 0) {
		// Reverse the links to match original order
		const reversedLinks = [...page.links].reverse();

		for (const link of reversedLinks) {
			if (link.url != null) {
				// Create favicon asset if link has media
				let faviconHash: TAssetHash | undefined;
				if (link.media?.url != null) {
					const faviconAsset = createImageAssetFromUrl(link.media.url);
					assets.push(faviconAsset);
					faviconHash = faviconAsset.hash;
				}

				// Determine variant based on __typename
				let content: TLinkNode['content'];
				let autoLayout: TLinkNode['autoLayout'] = linkNodeMetadata.default.autoLayout;
				let appearance: TLinkNode['appearance'] = linkNodeMetadata.default.appearance;

				switch (link.__typename) {
					case 'YouTubeVideoLink': {
						const videoId = extractYouTubeVideoId(link.url);
						if (videoId != null) {
							content = {
								type: 'youtube-video-embed' as const,
								url: link.url,
								videoId
							};
							autoLayout = {
								...linkNodeMetadata.default.autoLayout,
								horizontalPadding: 0,
								verticalPadding: 0
							};
							appearance = {
								...linkNodeMetadata.default.appearance,
								borderRadius: Math.min(borderRadius, 40)
							};
						} else {
							content = {
								type: 'single' as const,
								url: link.url,
								userTitle: link.title,
								userFavicon: faviconHash
							};
						}
						break;
					}
					default:
						content = {
							type: 'single' as const,
							url: link.url,
							userTitle: link.title,
							userFavicon: faviconHash
						};
				}

				// Create link node for links with URLs
				children.push({
					id: createId('node'),
					type: 'link',
					...linkNodeMetadata.default,
					content,
					autoLayout,
					appearance
				} satisfies TLinkNode);
			} else {
				// Create text node for links without URLs
				children.push({
					id: createId('node'),
					type: 'text',
					...textNodeMetadata.default,
					content: {
						type: 'default',
						text: { type: 'markdown', value: link.title }
					}
				} satisfies TTextNode);
			}
		}
	}

	const defaultTheme = themes[0] as TTheme;
	return {
		version: 'v0.0.1',
		assets,
		integrations: [],
		root: {
			id: createId('node'),
			type: 'page',
			content: {
				type: 'default'
			},
			metadata: {},
			children,
			autoLayout: {
				horizontalPadding: 24,
				verticalPadding: 48,
				verticalGap: 24,
				horizontalGap: undefined
			},
			appearance: {
				visible: true,
				opacity: 1,
				borderRadius: 0
			},
			fill: {
				paint: backgroundPaint,
				opacity: 1
			}
		},
		tokens: createTokensFromTheme({
			...defaultTheme,
			key: 'linkpop',
			name: 'LinkPop Import',
			color: {
				...defaultTheme.color,
				base100: cssRgbaToHex(page?.themeSettings?.linkCardColor) ?? defaultTheme.color.base100,
				base200: cssRgbaToHex(page?.themeSettings?.backgroundColor) ?? defaultTheme.color.base200,
				baseContent:
					cssRgbaToHex(page?.themeSettings?.linkCardFontColor) ?? defaultTheme.color.baseContent,
				primary: cssRgbaToHex(page?.themeSettings?.linkCardFontColor) ?? defaultTheme.color.primary,
				primaryContent:
					cssRgbaToHex(page?.themeSettings?.linkCardColor) ?? defaultTheme.color.primaryContent
			},
			typography: {
				heading: {
					fontFamily: primaryFont,
					fontWeight: defaultTheme.typography.heading.fontWeight
				},
				text: { fontFamily: primaryFont, fontWeight: defaultTheme.typography.text.fontWeight }
			},
			radius: {
				box: borderRadius,
				field: borderRadius * 0.5,
				selector: borderRadius * 0.25
			}
		})
	};
}

function transformSocialLinks(
	linkpopSocialLinks: Array<{ id: string; handle: string; network: string }>
): TContactIcon[] {
	const contactIcons: TContactIcon[] = [];

	for (const social of linkpopSocialLinks) {
		const contactMetadata = getSocialContactMetadata(social.network);
		if (contactMetadata != null) {
			contactIcons.push({
				id: shortId(),
				action: {
					type: 'social',
					provider: contactMetadata.provider,
					handle: social.handle,
					url: contactMetadata.getUrl(social.handle)
				},
				title: contactMetadata.getTitle(social.handle)
			});
		}
	}

	return contactIcons;
}

function createFontAsset(fontFamily: string): TFontAsset {
	const fontMetadata = getFontMetadataByFamily(fontFamily) ?? fontMetadataMap.inter;

	return {
		id: createId('asset'),
		type: 'font',
		hash: getFontHash({
			family: fontFamily,
			weight: 400,
			style: 'normal'
		}),
		contentType: 'font/woff2', // Google Fonts serves woff2
		fileName: `${fontFamily.toLowerCase().replace(/\s+/g, '-')}.woff2`,
		storage: {
			type: 'url',
			url: `https://fonts.googleapis.com/css2?family=${fontMetadata.googleFont}&display=swap`
		},
		font: {
			family: fontFamily,
			weight: 400,
			style: 'normal'
		}
	};
}

function createImageAssetFromUrl(url: string): TImageAsset {
	const hash: TAssetHash = shortId() as TAssetHash; // TODO: Re-upload the image to Shopify CDN
	const pathname = new URL(url).pathname.toLowerCase();

	let contentType: TImageAsset['contentType'] = 'image/jpeg';
	if (pathname.endsWith('.png')) {
		contentType = 'image/png';
	} else if (pathname.endsWith('.gif')) {
		contentType = 'image/gif';
	} else if (pathname.endsWith('.webp')) {
		contentType = 'image/webp';
	} else if (pathname.endsWith('.svg')) {
		contentType = 'image/svg+xml';
	}

	return {
		id: createId('asset'),
		type: 'image',
		hash,
		contentType,
		fileName: pathname.split('/').pop() || `image-${hash}`,
		storage: {
			type: 'url',
			url
		}
	};
}

function getBorderRadiusFromShape(shape: string | null | undefined): number {
	if (shape == null) {
		return 8;
	}

	switch (shape) {
		case 'square':
			return 0;
		case 'rounded_small':
			return 4;
		case 'rounded_large':
			return 999; // Very large radius for pill shape
		default:
			return 8; // Default fallback
	}
}
