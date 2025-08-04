import { TLinkNode } from '@repo/editor';

export const linkVariantMetadata: TLinkVariantMetadata[] = [
	{
		type: 'default',
		label: 'Default',
		isApplicable: () => true // Always available
	},
	{
		type: 'youtube-video',
		label: 'YouTube Video',
		isApplicable: (url) => {
			if (!url.trim().length) {
				return false;
			}

			return (
				/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/i.test(url) ||
				/^https?:\/\/youtu\.be\//i.test(url)
			);
		}
	},
	{
		type: 'youtube-channel',
		label: 'YouTube Channel',
		isApplicable: (url) => {
			if (!url.trim().length) {
				return false;
			}

			return (
				/^https?:\/\/(www\.)?youtube\.com\/channel\//i.test(url) ||
				/^https?:\/\/(www\.)?youtube\.com\/@/i.test(url)
			);
		}
	},
	{
		type: 'youtube-video-embed',
		label: 'YouTube Video Embed',
		isApplicable: (url) => {
			if (!url.trim().length) {
				return false;
			}

			return (
				/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/i.test(url) ||
				/^https?:\/\/youtu\.be\//i.test(url)
			);
		}
	}
];

type TVariantType = NonNullable<TLinkNode['content']['variant']>['type'];

export interface TLinkVariantMetadata {
	type: TVariantType;
	label: string;
	isApplicable: (url: string) => boolean;
}

export function getAvailableVariants(url: string): Array<{ label: string; value: TVariantType }> {
	return linkVariantMetadata
		.filter((variant) => variant.isApplicable(url))
		.map((variant) => ({
			label: variant.label,
			value: variant.type
		}));
}
