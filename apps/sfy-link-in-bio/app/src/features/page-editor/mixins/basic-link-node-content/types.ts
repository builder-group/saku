import { TBaseMixin } from '@repo/editor';
import { TResolvedAsset } from '../../lib';

export type TResolvedBasicLinkNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'basic';
		url: string;
		title?: string;
		description?: string;
		thumbnail?: TResolvedAsset;
	}
>;
