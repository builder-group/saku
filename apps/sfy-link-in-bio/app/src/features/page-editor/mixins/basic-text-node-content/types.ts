import { TBaseMixin } from '@repo/editor';

export type TResolvedBasicTextNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'basic';
		text: string;
	}
>;
