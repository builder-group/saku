import { TBaseMixin, TIdMixin, TNodeBundle } from '@repo/editor';
import {
	TResolvedAppearanceStyleMixin,
	TResolvedAutoLayoutStyleMixin,
	TResolvedBasicPageNodeContentMixin,
	TResolvedChildrenMixin,
	TResolvedFillStyleMixin,
	TResolvedTextCaptionStyleMixin
} from '../../mixins';

export type TResolvedPageNode = TResolvedClassicPageNodeBundle;

export type TResolvedClassicPageNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin,
		TResolvedPageNodeMixin,
		TResolvedBasicPageNodeContentMixin,
		TResolvedChildrenMixin,
		TResolvedAutoLayoutStyleMixin,
		TResolvedAppearanceStyleMixin,
		TResolvedFillStyleMixin,
		TResolvedTextCaptionStyleMixin
	]
>;

export type TResolvedPageNodeMixin = TBaseMixin<
	'node',
	{
		type: 'page';
		metadata: {
			title: string;
			description: string;
			favicon: string;
			image?: string;
		};
		watermarkVisible: boolean;
	}
>;
