import { TRgba } from '../lib';
import { TId } from '../lib/id';
import { TFont, TPaint } from '../types';
import {
	TAboutContentMixin,
	TBorderMixin,
	TChildrenMixin,
	TFillMixin,
	TFlatChildrenMixin,
	TIdMixin,
	TLayoutMixin,
	TLinkContentMixin,
	TMediaContentMixin,
	TMergeMixins,
	TMixin,
	TPageContentMixin,
	TProductContentMixin,
	TTextContentMixin,
	TTypographyMixin
} from './mixins';

export type TNode = TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode | TProductNode;
export type TFlatNode =
	| TFlatPageNode
	| TAboutNode
	| TLinkNode
	| TMediaNode
	| TTextNode
	| TProductNode;

export type TNodeId = TId<'node'>;

export interface TBaseNode {
	type: string;
}

export type TNodeType<GType extends string, GMixins extends TMixin<any, any>[]> = TBaseNode & {
	type: GType;
} & TMergeMixins<GMixins>;

// =========================================================================
// Nodes
// =========================================================================

export type TPageNode = TNodeType<
	'page',
	[
		TIdMixin,
		TPageContentMixin,
		TFillMixin,
		TMixin<
			'layout',
			{
				spacing: number;
			}
		>,
		TChildrenMixin,
		TMixin<
			'childDefaults',
			{
				fill: TPaint;
				layout: {
					padding: number;
				};
				typography: {
					font: TFont;
					fontSize: number;
					textColor: TRgba;
					textAlign: 'left' | 'center' | 'right';
					lineHeight: number;
					letterSpacing: number;
					fontWeight: number;
				};
				border: {
					radius: number;
					width: number;
					color: TRgba;
				};
				shadow: {
					color: TRgba;
					offsetX: number;
					offsetY: number;
					blur: number;
					spread: number;
				};
			}
		>
	]
>;

export interface TFlatPageNode extends Omit<TPageNode, 'children'>, TFlatChildrenMixin {}

export type TAboutNode = TNodeType<
	'about',
	[TIdMixin, TAboutContentMixin, TFillMixin, TBorderMixin, TLayoutMixin, TTypographyMixin]
>;

export type TLinkNode = TNodeType<
	'link',
	[TIdMixin, TLinkContentMixin, TFillMixin, TBorderMixin, TLayoutMixin, TTypographyMixin]
>;

export type TMediaNode = TNodeType<
	'media',
	[TIdMixin, TMediaContentMixin, TFillMixin, TBorderMixin, TLayoutMixin]
>;

export type TTextNode = TNodeType<
	'text',
	[TIdMixin, TTextContentMixin, TFillMixin, TBorderMixin, TLayoutMixin, TTypographyMixin]
>;

export type TProductNode = TNodeType<
	'product',
	[TIdMixin, TProductContentMixin, TFillMixin, TBorderMixin, TLayoutMixin, TTypographyMixin]
>;
