import { TBaseMixin, TContactIcon } from '@repo/editor';
import { TResolvedAsset } from '../../lib';

export type TResolvedBasicAboutNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'basic';
		name: string;
		bio?: string;
		avatar?: TResolvedAsset;
		contactIcons: TContactIcon[];
	}
>;
