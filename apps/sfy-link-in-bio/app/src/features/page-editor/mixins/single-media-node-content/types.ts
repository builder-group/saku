import { TBaseMixin } from '@repo/editor';
import { TResolvedAsset } from '../../lib';

export type TResolvedSingleMediaNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'single';
		media?: {
			type: 'image' | 'video' | 'audio';
			altText?: string;
		} & TResolvedAsset;
	}
>;
