import { TBaseMixin, TRichContent } from '@repo/editor';

export type TResolvedRichTextNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'rich';
		text: TRichContent;
	}
>;
