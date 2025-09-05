import { shortId } from '@blgc/utils';
import {
	createId,
	createTokensFromTheme,
	cssRgbaToRgba,
	fontMetadataMap,
	getFontHash,
	getFontMetadataByFamily,
	hexToRgba,
	TAboutNode,
	TAsset,
	TAssetHash,
	TFontAsset,
	themes,
	TImageAsset,
	TLinkNode,
	tokenRef,
	TPaint,
	TSite,
	TSocialLink,
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
			content: {
				type: 'default',
				name: page.title ?? 'Your Name',
				bio: page.bio,
				profilePicture: profilePictureHash,
				socialLinks: transformSocialLinks(page.socialMediaAccounts ?? [])
			},
			autoLayout: {
				horizontalPadding: tokenRef(),
				verticalPadding: tokenRef(),
				horizontalGap: undefined,
				verticalGap: undefined
			},
			appearance: {
				visible: true,
				opacity: tokenRef(),
				borderRadius: 0
			},
			fill: null,
			stroke: null,
			shadow: null,
			xlText: {
				appearance: {
					visible: true,
					opacity: tokenRef('xl'),
					borderRadius: undefined
				},
				typography: {
					font: tokenRef('xl'),
					fontSize: tokenRef('xl'),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: tokenRef('xl'),
					letterSpacing: tokenRef('xl')
				},
				fill: {
					paint: {
						type: 'solid',
						color: cssRgbaToRgba(page?.themeSettings?.fontColor) ?? hexToRgba('#000000')
					},
					opacity: 1
				},
				stroke: null,
				shadow: null
			},
			text: {
				appearance: {
					visible: true,
					opacity: tokenRef(),
					borderRadius: undefined
				},
				typography: {
					font: tokenRef(),
					fontSize: tokenRef(),
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: tokenRef(),
					letterSpacing: tokenRef()
				},
				fill: {
					paint: {
						type: 'solid',
						color: cssRgbaToRgba(page?.themeSettings?.fontColor) ?? hexToRgba('#000000')
					},
					opacity: 1
				},
				stroke: null,
				shadow: null
			},
			image: {
				appearance: {
					visible: true,
					opacity: tokenRef(),
					borderRadius: tokenRef()
				},
				stroke: null,
				shadow: null
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
				let autoLayout: TLinkNode['autoLayout'] = {
					horizontalPadding: tokenRef(),
					verticalPadding: tokenRef(),
					horizontalGap: undefined,
					verticalGap: undefined
				};
				let appearance: TLinkNode['appearance'] = {
					visible: true,
					opacity: tokenRef(),
					borderRadius: tokenRef()
				};

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
								horizontalPadding: 0,
								verticalPadding: 0,
								horizontalGap: undefined,
								verticalGap: undefined
							};
							appearance = {
								visible: true,
								opacity: tokenRef(),
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
					content,
					autoLayout,
					appearance,
					fill: tokenRef(),
					stroke: tokenRef(),
					shadow: tokenRef(),
					text: {
						appearance: {
							visible: true,
							opacity: tokenRef(),
							borderRadius: undefined
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
					},
					smText: {
						appearance: {
							visible: true,
							opacity: tokenRef('sm'),
							borderRadius: undefined
						},
						typography: {
							font: tokenRef('sm'),
							fontSize: tokenRef('sm'),
							textAlignHorizontal: tokenRef('sm'),
							textAlignVertical: tokenRef('sm'),
							lineHeight: tokenRef('sm'),
							letterSpacing: tokenRef('sm')
						},
						fill: tokenRef('sm'),
						stroke: tokenRef('sm'),
						shadow: tokenRef('sm')
					},
					image: {
						appearance: {
							visible: true,
							opacity: tokenRef(),
							borderRadius: tokenRef()
						},
						stroke: tokenRef(),
						shadow: tokenRef()
					}
				} satisfies TLinkNode);
			} else {
				// Create text node for links without URLs
				children.push({
					id: createId('node'),
					type: 'text',
					content: {
						type: 'default',
						text: { type: 'markdown', value: link.title }
					},
					autoLayout: {
						horizontalPadding: tokenRef(),
						verticalPadding: tokenRef(),
						horizontalGap: undefined,
						verticalGap: undefined
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
							opacity: tokenRef(),
							borderRadius: undefined
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
				base100: page?.themeSettings?.linkCardColor ?? defaultTheme.color.base100,
				base200: page?.themeSettings?.backgroundColor ?? defaultTheme.color.base200,
				baseContent: page?.themeSettings?.linkCardFontColor ?? defaultTheme.color.baseContent,
				primary: page?.themeSettings?.linkCardFontColor ?? defaultTheme.color.primary,
				primaryContent: page?.themeSettings?.linkCardColor ?? defaultTheme.color.primaryContent
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
): TSocialLink[] {
	const validSocialLinks: TSocialLink[] = [];

	for (const social of linkpopSocialLinks) {
		const provider = mapSocialPlatform(social.network);
		if (provider != null) {
			validSocialLinks.push({
				id: shortId(),
				provider,
				handle: social.handle,
				url: constructSocialUrl(provider, social.handle)
			});
		}
	}

	return validSocialLinks;
}

function mapSocialPlatform(platform: string): TSocialLink['provider'] | null {
	const platformLower = platform.toLowerCase();

	const platformMap: Record<string, TSocialLink['provider']> = {
		instagram: 'instagram',
		twitter: 'twitter',
		x: 'twitter', // X is the new Twitter
		youtube: 'youtube',
		tiktok: 'tiktok',
		linkedin: 'linkedin',
		facebook: 'facebook',
		shop: 'shopify', // LinkPop uses "shop" for Shopify stores
		shopify: 'shopify',
		bluesky: 'bluesky',
		discord: 'discord',
		github: 'github',
		google: 'google',
		spotify: 'spotify'
	};

	return platformMap[platformLower] ?? null;
}

function constructSocialUrl(provider: TSocialLink['provider'], handleOrUrl: string): string {
	const urlMap: Record<TSocialLink['provider'], string> = {
		instagram: `https://instagram.com/${handleOrUrl}`,
		twitter: `https://twitter.com/${handleOrUrl}`,
		youtube: `https://youtube.com/@${handleOrUrl}`,
		tiktok: `https://tiktok.com/@${handleOrUrl}`,
		linkedin: `https://linkedin.com/in/${handleOrUrl}`,
		facebook: `https://facebook.com/${handleOrUrl}`,
		shopify: handleOrUrl, // This case is handled above
		bluesky: `https://bsky.app/profile/${handleOrUrl}`,
		discord: `https://discord.gg/${handleOrUrl}`,
		github: `https://github.com/${handleOrUrl}`,
		google: `https://plus.google.com/${handleOrUrl}`,
		spotify: `https://open.spotify.com/user/${handleOrUrl}`,
		pinterest: `https://pinterest.com/${handleOrUrl}`
	};

	return urlMap[provider];
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
