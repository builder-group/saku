import { shortId } from '@blgc/utils';
import { AppError } from '@repo/hono-utils';
import { getFontMetadataByFamily } from './font-metadata';
import { getFontHash } from './get-font-hash';
import { TLinkPopData } from './parse-linkpop-html';
import { TAboutNode, TFontAsset, TLinkNode, TSite, TSocialLink, TTextNode } from './site-types';

export function transformLinkpopToSite(linkpopData: TLinkPopData): TSite {
	const children: (TAboutNode | TLinkNode | TTextNode)[] = [];
	const assets: TFontAsset[] = [];
	const page = linkpopData.page;

	// Create font asset for primary font
	const primaryFont = page?.themeSettings?.primaryFont ?? 'Inter';
	const fontAsset = createFontAsset(primaryFont);
	assets.push(fontAsset);

	// Create about node if we have profile data
	if (page?.title != null || page?.bio != null) {
		const aboutNode: TAboutNode = {
			id: shortId(),
			type: 'about',
			name: page.title ?? 'Your Name',
			bio: page.bio,
			profilePicture: page.media?.url,
			socialLinks: transformSocialLinks(page.socialMediaAccounts ?? []),
			visible: true,
			style: {
				padding: 'inherit',
				margin: 'inherit',
				backgroundColor: 'inherit',
				font: 'inherit',
				fontSize: 'inherit',
				textColor: 'inherit',
				textAlign: 'inherit',
				borderRadius: 'inherit',
				shadow: 'inherit'
			}
		};
		children.push(aboutNode);
	}

	// Transform links and text nodes
	if (page?.links != null && page.links.length > 0) {
		for (const link of page.links) {
			if (link.url != null) {
				// Create link node for links with URLs
				children.push({
					id: shortId(),
					type: 'link',
					url: link.url,
					visible: true,
					meta: {
						title: link.title
					},
					style: {
						padding: 'inherit',
						margin: 'inherit',
						backgroundColor: 'inherit',
						font: 'inherit',
						fontSize: 'inherit',
						textColor: 'inherit',
						textAlign: 'inherit',
						borderRadius: 'inherit',
						shadow: 'inherit'
					}
				} satisfies TLinkNode);
			} else {
				// Create text node for links without URLs
				children.push({
					id: shortId(),
					type: 'text',
					title: undefined,
					text: link.title,
					visible: true,
					style: {
						padding: 'inherit',
						margin: 'inherit',
						backgroundColor: 'inherit',
						font: 'inherit',
						fontSize: 'inherit',
						textColor: 'inherit',
						textAlign: 'inherit',
						borderRadius: 'inherit',
						shadow: 'inherit'
					}
				} satisfies TTextNode);
			}
		}
	}

	return {
		version: 'v0.0.1',
		id: shortId(),
		assets,
		root: {
			id: shortId(),
			type: 'page',
			visible: true,
			children,
			style: {
				backgroundColor: page?.themeSettings?.backgroundColor ?? '#ffffff',
				children: {
					backgroundColor: page?.themeSettings?.linkCardColor ?? '#000000',
					spacing: 16,
					padding: 16,
					margin: 8,
					font: {
						family: primaryFont,
						weight: 400,
						style: 'normal'
					},
					fontSize: 16,
					textColor: page?.themeSettings?.fontColor ?? '#000000',
					textAlign: 'center',
					borderRadius: 8,
					shadow: false
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
		shopify: 'shopify',
		bluesky: 'bluesky',
		discord: 'discord',
		github: 'github',
		google: 'google',
		spotify: 'spotify'
	};

	return platformMap[platformLower] ?? null;
}

function constructSocialUrl(provider: TSocialLink['provider'], handle: string): string {
	const urlMap: Record<TSocialLink['provider'], string> = {
		instagram: `https://instagram.com/${handle}`,
		twitter: `https://twitter.com/${handle}`,
		youtube: `https://youtube.com/@${handle}`,
		tiktok: `https://tiktok.com/@${handle}`,
		linkedin: `https://linkedin.com/in/${handle}`,
		facebook: `https://facebook.com/${handle}`,
		shopify: `https://${handle}.myshopify.com`,
		bluesky: `https://bsky.app/profile/${handle}`,
		discord: `https://discord.gg/${handle}`,
		github: `https://github.com/${handle}`,
		google: `https://plus.google.com/${handle}`,
		spotify: `https://open.spotify.com/user/${handle}`
	};

	return urlMap[provider];
}

function createFontAsset(fontFamily: string): TFontAsset {
	const fontMetadata = getFontMetadataByFamily(fontFamily);
	if (fontMetadata == null) {
		throw new AppError(`#ERR_FONT_METADATA_NOT_FOUND`, 400, {
			detail: `Font metadata not found for family: ${fontFamily}`
		});
	}

	return {
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
