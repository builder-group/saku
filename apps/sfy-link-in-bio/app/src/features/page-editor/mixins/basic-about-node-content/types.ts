import { TBaseMixin, TContactLink } from '@repo/editor';
import { TResolvedAsset } from '../../lib';

export type TResolvedBasicAboutNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'basic';
		title: string;
		description?: string;
		avatar?: TResolvedAsset;
		contactLinks: TContactLink[];
	}
>;
