import { TBaseMixin, TFooterLink } from '@repo/editor';

export type TResolvedBasicPageNodeContentMixin = TBaseMixin<
	'content',
	{
		type: 'basic';
		navbar: {
			visible: boolean;
			shareButtonVisible: boolean;
		};
		footer: {
			visible: boolean;
			links: TFooterLink[];
		};
	}
>;
