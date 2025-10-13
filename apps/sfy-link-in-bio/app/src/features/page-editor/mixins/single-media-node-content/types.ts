import { TBaseMixin } from '@repo/editor';
import { TResolvedAsset } from '../../lib';

export type TResolvedSingleMediaNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'single';
		media?: TResolvedMedia;
	}
>;

export interface TResolvedMedia extends TResolvedAsset {
	type: 'image' | 'video' | 'audio';
	altText?: string;
}
