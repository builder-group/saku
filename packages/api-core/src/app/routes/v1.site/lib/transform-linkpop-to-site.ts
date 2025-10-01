import { shortId } from '@blgc/utils';
import {
	aboutNodeMetadata,
	createId,
	createTokensFromTheme,
	cssRgbaToRgba,
	extractSpotifyId,
	extractYouTubeId,
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
	tokenRef,
	TPaint,
	TSite,
	TSolidPaint,
	TTextNode,
	TTheme
} from '@repo/editor';
import { TLinkPopData } from './parse-linkpop-html';

export function transformLinkpopToSite(linkpopData: TLinkPopData): TSite {
	const children: (TAboutNode | TLinkNode | TTextNode)[] = [];
	const assets: TAsset[] = [];
	const page = linkpopData.page;

	// Create font asset for primary font
	const primaryFontAsset = createFontAsset(page?.themeSettings?.primaryFont);
	assets.push(primaryFontAsset);

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
			image: {
				appearance: {
					visible: true,
					opacity: tokenRef('image.default', 'image', 'appearance.opacity'),
					borderRadius: 48
				},
				stroke: tokenRef('image.default', 'image', 'stroke'),
				shadow: tokenRef('image.default', 'image', 'shadow')
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
					case 'YouTubeVideoLink':
					case 'YouTubePlaylistLink': {
						const youtubeData = extractYouTubeId(link.url);
						if (youtubeData != null) {
							content = {
								type: 'youtube-embed' as const,
								url: link.url,
								contentType: youtubeData.type,
								contentId: youtubeData.id
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
					case 'SpotifyAlbumLink':
					case 'SpotifyTrackLink':
					case 'SpotifyPlaylistLink':
					case 'SpotifyArtistLink': {
						const spotifyData = extractSpotifyId(link.url);
						if (spotifyData != null) {
							content = {
								type: 'spotify-embed' as const,
								url: link.url,
								contentType: spotifyData.type,
								contentId: spotifyData.id,
								height: 352 // Default to normal height
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
				type: 'default',
				hasWatermark: true
			},
			metadata: {},
			children,
			autoLayout: {
				horizontalPadding: 24,
				verticalPadding: 48,
				verticalGap: 24,
				horizontalGap: null
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
			paint: {
				...defaultTheme.paint,
				base100: cssRgbaToPaint(page?.themeSettings?.linkCardColor) ?? defaultTheme.paint.base100,
				base100Content:
					cssRgbaToPaint(page?.themeSettings?.linkCardFontColor) ??
					defaultTheme.paint.base100Content,
				base200: cssRgbaToPaint(page?.themeSettings?.backgroundColor) ?? defaultTheme.paint.base200,
				base200Content:
					cssRgbaToPaint(page?.themeSettings?.fontColor) ?? defaultTheme.paint.base200Content,
				primary:
					cssRgbaToPaint(page?.themeSettings?.linkCardFontColor) ?? defaultTheme.paint.primary,
				primaryContent:
					cssRgbaToPaint(page?.themeSettings?.linkCardColor) ?? defaultTheme.paint.primaryContent
			},
			typography: {
				heading: {
					fontFamily: primaryFontAsset.font.family,
					fontWeight: defaultTheme.typography.heading.fontWeight
				},
				text: {
					fontFamily: primaryFontAsset.font.family,
					fontWeight: defaultTheme.typography.text.fontWeight
				}
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

function createFontAsset(fontFamily?: string): TFontAsset {
	const fontMetadata = getFontMetadataByFamily(fontFamily) ?? fontMetadataMap.inter;

	return {
		id: createId('asset'),
		type: 'font',
		hash: getFontHash({
			family: fontMetadata.font.family,
			weight: 400,
			style: 'normal'
		}),
		contentType: 'font/woff2', // Google Fonts serves woff2
		fileName: `${fontMetadata.font.family.toLowerCase().replace(/\s+/g, '-')}.woff2`,
		storage: {
			type: 'url',
			url: `https://fonts.googleapis.com/css2?family=${fontMetadata.googleFont}&display=swap`
		},
		font: {
			family: fontMetadata.font.family,
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
			return 48; // Very large radius for pill shape
		default:
			return 8; // Default fallback
	}
}

function cssRgbaToPaint(cssRgba?: string): TSolidPaint | undefined {
	const rgba = cssRgbaToRgba(cssRgba);
	if (rgba == null) {
		return undefined;
	}

	return {
		type: 'solid',
		color: rgba
	};
}
