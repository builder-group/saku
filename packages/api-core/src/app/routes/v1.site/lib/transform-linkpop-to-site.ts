import { shortId } from '@blgc/utils';
import {
	createId,
	cssRgbaToRgba,
	fontMetadataMap,
	getFontHash,
	getFontMetadataByFamily,
	hexToRgba,
	TAboutNode,
	TAsset,
	TAssetHash,
	TFontAsset,
	TImageAsset,
	TLinkNode,
	tokenRef,
	TPaint,
	TSite,
	TSocialLink,
	TTextNode
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
				name: page.title ?? 'Your Name',
				bio: page.bio,
				profilePicture: profilePictureHash,
				socialLinks: transformSocialLinks(page.socialMediaAccounts ?? [])
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
					fontSize: 16,
					textAlignHorizontal: 'center',
					textAlignVertical: 'center',
					lineHeight: tokenRef(),
					letterSpacing: tokenRef()
				},
				fill: {
					paint: {
						type: 'solid',
						color: cssRgbaToRgba(page?.themeSettings?.fontColor) ?? hexToRgba('#000000')
					}
				},
				stroke: null,
				shadow: null
			}
		} as TAboutNode;
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
				let variant: TLinkNode['content']['variant'];
				let autoLayout: TLinkNode['autoLayout'] = {
					horizontalPadding: tokenRef(),
					verticalPadding: tokenRef(),
					horizontalGap: tokenRef(),
					verticalGap: tokenRef()
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
							variant = {
								type: 'youtube-video-embed' as const,
								videoId
							};
							autoLayout = {
								horizontalPadding: 0,
								verticalPadding: 0,
								horizontalGap: 0,
								verticalGap: 0
							};
							appearance = {
								visible: true,
								opacity: tokenRef(),
								borderRadius: Math.min(borderRadius, 40)
							};
						} else {
							variant = {
								type: 'default' as const,
								userTitle: link.title,
								userFavicon: faviconHash
							};
						}
						break;
					}
					default:
						variant = {
							type: 'default' as const,
							userTitle: link.title,
							userFavicon: faviconHash
						};
				}

				// Create link node for links with URLs
				children.push({
					id: createId('node'),
					type: 'link',
					content: {
						url: link.url,
						variant
					},
					autoLayout,
					appearance,
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
				} satisfies TLinkNode);
			} else {
				// Create text node for links without URLs
				children.push({
					id: createId('node'),
					type: 'text',
					content: {
						text: link.title
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
				} satisfies TTextNode);
			}
		}
	}

	return {
		version: 'v0.0.1',
		assets,
		integrations: [],
		root: {
			id: createId('node'),
			type: 'page',
			content: {
				metadata: {}
			},
			children,
			autoLayout: {
				horizontalPadding: 24,
				verticalPadding: 48,
				verticalGap: 24
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
		tokens: [
			{
				type: 'autoLayout',
				key: 'default',
				value: {
					horizontalPadding: 12,
					verticalPadding: 12,
					horizontalGap: 12,
					verticalGap: 12
				}
			},
			{
				type: 'appearance',
				key: 'default',
				value: {
					visible: true,
					opacity: 1,
					borderRadius
				}
			},
			{
				type: 'fill',
				key: 'default',
				value: {
					paint: {
						type: 'solid',
						color: cssRgbaToRgba(page?.themeSettings?.linkCardColor) ?? hexToRgba('#FFFFFF')
					},
					opacity: 1
				}
			},
			{
				type: 'stroke',
				key: 'default',
				value: null
			},
			{
				type: 'shadow',
				key: 'default',
				value: {
					color: { r: 0, g: 0, b: 0, a: 0.1 },
					offsetX: 0,
					offsetY: 2,
					blur: 4,
					spread: 0
				}
			},
			{
				type: 'text',
				key: 'default',
				value: {
					appearance: {
						visible: true,
						opacity: 1
					},
					typography: {
						font: {
							family: primaryFont,
							weight: 400,
							style: 'normal'
						},
						fontSize: 16,
						textAlignHorizontal: 'center',
						textAlignVertical: 'center',
						lineHeight: { type: 'auto' },
						letterSpacing: { type: 'auto' }
					},
					fill: {
						paint: {
							type: 'solid',
							color: cssRgbaToRgba(page?.themeSettings?.linkCardFontColor) ?? hexToRgba('#000000')
						},
						opacity: 1
					},
					stroke: null,
					shadow: null
				}
			},
			{
				type: 'button',
				key: 'default',
				value: {
					appearance: {
						visible: true,
						opacity: 1,
						borderRadius: borderRadius * 0.5
					},
					fill: {
						paint: {
							type: 'solid',
							color: cssRgbaToRgba(page?.themeSettings?.linkCardFontColor) ?? hexToRgba('#FFFFFF')
						},
						opacity: 1
					},
					stroke: null,
					shadow: null,
					text: {
						appearance: {
							visible: true,
							opacity: 1
						},
						typography: {
							font: {
								family: primaryFont,
								weight: 400,
								style: 'normal'
							},
							fontSize: 16,
							textAlignHorizontal: 'center',
							textAlignVertical: 'center',
							lineHeight: { type: 'auto' },
							letterSpacing: { type: 'auto' }
						},
						fill: {
							paint: {
								type: 'solid',
								color: cssRgbaToRgba(page?.themeSettings?.linkCardColor) ?? hexToRgba('#000000')
							},
							opacity: 1
						},
						stroke: null,
						shadow: null
					}
				}
			}
		]
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
