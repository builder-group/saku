import { shortId } from '@blgc/utils';
import {
	aboutNodeMetadata,
	createId,
	createThemeTokens,
	cssRgbaToRgba,
	extractSpotifyId,
	extractYouTubeId,
	fontMetadataMap,
	getFontHash,
	getFontMetadataByFamily,
	getSocialContactMetadata,
	hexToRgba,
	linkNodeMetadata,
	pageNodeMetadata,
	TAboutNode,
	TAsset,
	TAssetHash,
	TClassicAboutNodeBundle,
	TClassicLinkNodeBundle,
	TContactLink,
	textNodeMetadata,
	TFontAsset,
	themes,
	TImageAsset,
	TLinkNode,
	tokenRef,
	TPaint,
	TRichTextNodeBundle,
	TSite,
	TSolidPaint,
	TSpotifyEmbedLinkNodeBundle,
	TTextNode,
	TTheme,
	TYouTubeEmbedLinkNodeBundle
} from '@repo/editor';
import { TLinkPopData } from './parse-linkpop-html';

export function parseLinkpopData(linkpopData: TLinkPopData): TSite {
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
		// Create image asset if page has an avatar
		let avatarHash: string | undefined;
		if (page?.media?.url != null) {
			const avatarAsset = createImageAssetFromUrl(page.media.url);
			assets.push(avatarAsset);
			avatarHash = avatarAsset.hash;
		}

		const aboutNode: TClassicAboutNodeBundle = {
			...aboutNodeMetadata.bundleMap.classic,
			id: createId('node'),
			content: {
				type: 'basic',
				title: page.title ?? 'Your Name',
				description: page.bio,
				avatar: avatarHash,
				contactLinks: mapSocialLinks(page.socialMediaAccounts ?? [])
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
				// Create image asset if link has media
				let thumbnailHash: TAssetHash | undefined;
				if (link.media?.url != null) {
					const thumbnailAsset = createImageAssetFromUrl(link.media.url);
					assets.push(thumbnailAsset);
					thumbnailHash = thumbnailAsset.hash;
				}

				// Determine variant based on __typename
				let content: TLinkNode['content'];
				let autoLayout: TLinkNode['autoLayout'] = linkNodeMetadata.bundleMap.classic.autoLayout;
				let appearance: TLinkNode['appearance'] = linkNodeMetadata.bundleMap.classic.appearance;

				switch (link.__typename) {
					case 'YouTubeVideoLink':
					case 'YouTubePlaylistLink': {
						const youtubeData = extractYouTubeId(link.url);
						if (youtubeData != null) {
							content = {
								type: 'youtube-embed',
								url: link.url,
								contentType: youtubeData.type,
								contentId: youtubeData.id
							};
							autoLayout = linkNodeMetadata.bundleMap['youtube-embed'].autoLayout;
							appearance = {
								...linkNodeMetadata.bundleMap['youtube-embed'].appearance,
								borderRadius: Math.min(borderRadius, 40)
							};
						} else {
							content = {
								type: 'basic',
								url: link.url,
								metadata: {},
								user: {
									title: link.title,
									thumbnail: thumbnailHash
								}
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
								type: 'spotify-embed',
								url: link.url,
								contentType: spotifyData.type,
								contentId: spotifyData.id,
								height: 352 // Default to normal height
							};
							autoLayout = linkNodeMetadata.bundleMap['spotify-embed'].autoLayout;
							appearance = {
								...linkNodeMetadata.bundleMap['spotify-embed'].appearance,
								borderRadius: Math.min(borderRadius, 40)
							};
						} else {
							content = {
								type: 'basic',
								url: link.url,
								metadata: {},
								user: {
									title: link.title,
									thumbnail: thumbnailHash
								}
							};
						}
						break;
					}
					default:
						content = {
							type: 'basic',
							url: link.url,
							metadata: {},
							user: {
								title: link.title,
								thumbnail: thumbnailHash
							}
						};
				}

				// Create link node for links with URLs
				switch (content.type) {
					case 'basic':
						children.push({
							...linkNodeMetadata.bundleMap.classic,
							id: createId('node'),
							content,
							autoLayout,
							appearance
						} satisfies TClassicLinkNodeBundle);
						break;
					case 'youtube-embed':
						children.push({
							...linkNodeMetadata.bundleMap['youtube-embed'],
							id: createId('node'),
							content,
							autoLayout,
							appearance
						} satisfies TYouTubeEmbedLinkNodeBundle);
						break;
					case 'spotify-embed':
						children.push({
							...linkNodeMetadata.bundleMap['spotify-embed'],
							id: createId('node'),
							content,
							autoLayout,
							appearance
						} satisfies TSpotifyEmbedLinkNodeBundle);
						break;
				}
			} else {
				// Create text node for links without URLs
				children.push({
					...textNodeMetadata.bundleMap.rich,
					id: createId('node'),
					content: {
						type: 'rich',
						text: { type: 'markdown', value: link.title }
					}
				} satisfies TRichTextNodeBundle);
			}
		}
	}

	const defaultTheme = themes[0] as TTheme;
	return {
		version: 'v0.0.1',
		assets,
		integrations: [],
		root: {
			...pageNodeMetadata.bundleMap.classic,
			id: createId('node'),
			children,
			fill: {
				paint: tokenRef('paint.base200', 'paint'),
				opacity: 1
			}
		},
		tokens: createThemeTokens({
			...defaultTheme,
			key: 'linkpop',
			name: 'LinkPop Import',
			paint: {
				...defaultTheme.paint,
				base100: cssRgbaToPaint(page?.themeSettings?.linkCardColor) ?? defaultTheme.paint.base100,
				base100Content:
					cssRgbaToPaint(page?.themeSettings?.linkCardFontColor) ??
					defaultTheme.paint.base100Content,
				base200: backgroundPaint ?? defaultTheme.paint.base200,
				base200Content:
					cssRgbaToPaint(page?.themeSettings?.fontColor) ?? defaultTheme.paint.base200Content,
				primary:
					cssRgbaToPaint(page?.themeSettings?.linkCardFontColor) ?? defaultTheme.paint.primary,
				primaryContent:
					cssRgbaToPaint(page?.themeSettings?.linkCardColor) ?? defaultTheme.paint.primaryContent
			},
			typography: {
				display: {
					fontFamily: primaryFontAsset.font.family,
					fontWeight: defaultTheme.typography.display.fontWeight
				},
				body: {
					fontFamily: primaryFontAsset.font.family,
					fontWeight: defaultTheme.typography.body.fontWeight
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

function mapSocialLinks(
	socialLinks: { id: string; handle: string; network: string }[]
): TContactLink[] {
	const contactLinks: TContactLink[] = [];

	for (const social of socialLinks) {
		const contactMetadata = getSocialContactMetadata(social.network);
		if (contactMetadata != null) {
			contactLinks.push({
				id: shortId(),
				action: {
					type: 'social',
					provider: contactMetadata.provider,
					handle: social.handle,
					url: contactMetadata.getUrl(social.handle)
				},
				altText: contactMetadata.getAltText(social.handle)
			});
		}
	}

	return contactLinks;
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
	const assetId = createId('asset');
	const hash = assetId; // Temporary workaround until proper content hashing

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
		id: assetId,
		type: 'image',
		hash,
		contentType,
		storage: {
			type: 'url',
			url
		},
		fileName: pathname.split('/').pop() || `image-${hash}`
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
