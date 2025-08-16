import { shortId } from '@blgc/utils';
import {
	createId,
	cssRgbaToRgba,
	fontMetadataMap,
	getFontHash,
	getFontMetadataByFamily,
	hexToRgba,
	inherit,
	TAboutNode,
	TAsset,
	TAssetHash,
	TFontAsset,
	TImageAsset,
	TLinkNode,
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
			layout: {
				padding: inherit()
			},
			appearance: {
				borderRadius: 0,
				opacity: inherit(),
				visible: inherit()
			},
			typography: {
				font: inherit(),
				fontSize: 16,
				textColor: cssRgbaToRgba(page?.themeSettings?.fontColor) ?? hexToRgba('#000000'),
				textAlign: inherit(),
				lineHeight: inherit(),
				letterSpacing: inherit()
			},
			fill: null,
			stroke: null,
			shadow: null
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
				switch (link.__typename) {
					case 'YouTubeVideoLink': {
						const videoId = extractYouTubeVideoId(link.url);
						if (videoId != null) {
							variant = {
								type: 'youtube-video-embed' as const,
								videoId
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
					layout: {
						padding: inherit()
					},
					appearance: {
						borderRadius: inherit(),
						opacity: inherit(),
						visible: inherit()
					},
					typography: {
						font: inherit(),
						fontSize: inherit(),
						textColor: inherit(),
						textAlign: inherit(),
						lineHeight: inherit(),
						letterSpacing: inherit()
					},
					fill: inherit(),
					stroke: inherit(),
					shadow: inherit()
				} satisfies TLinkNode);
			} else {
				// Create text node for links without URLs
				children.push({
					id: createId('node'),
					type: 'text',
					content: {
						text: link.title
					},
					layout: {
						padding: inherit()
					},
					appearance: {
						borderRadius: inherit(),
						opacity: inherit(),
						visible: inherit()
					},
					typography: {
						font: inherit(),
						fontSize: inherit(),
						textColor: inherit(),
						textAlign: inherit(),
						lineHeight: inherit(),
						letterSpacing: inherit()
					},
					fill: inherit(),
					stroke: inherit(),
					shadow: inherit()
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
			layout: {
				spacing: 16
			},
			appearance: {
				borderRadius: 0,
				opacity: 1,
				visible: true
			},
			fill: {
				paint: backgroundPaint,
				opacity: 1
			},
			childMixins: {
				layout: {
					padding: 8
				},
				appearance: {
					borderRadius: getBorderRadiusFromShape(page?.themeSettings?.linkCardShape),
					opacity: 1,
					visible: true
				},
				typography: {
					font: {
						family: primaryFont,
						weight: 400,
						style: 'normal'
					},
					fontSize: 14,
					textColor: cssRgbaToRgba(page?.themeSettings?.linkCardFontColor) ?? hexToRgba('#000000'),
					textAlign: 'center',
					lineHeight: 'auto',
					letterSpacing: 'auto'
				},
				fill: {
					paint: {
						type: 'solid',
						color: cssRgbaToRgba(page?.themeSettings?.linkCardColor) ?? hexToRgba('#FFFFFF')
					},
					opacity: 1
				},
				stroke: null,
				shadow: {
					color: { r: 0, g: 0, b: 0, a: 0.1 },
					offsetX: 0,
					offsetY: 2,
					blur: 4,
					spread: 0
				}
			}
		}
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
			return 9999; // Very large radius for pill shape
		default:
			return 8; // Default fallback
	}
}
