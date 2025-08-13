import { TRgba } from '../lib';
import { TId } from '../lib/id';
import { TFont, TPaint } from '../types';
import {
	TAboutContentMixin,
	TBorderMixin,
	TFillMixin,
	TIdMixin,
	TLayoutMixin,
	TLinkContentMixin,
	TMediaContentMixin,
	TMergeMixins,
	TMixin,
	TPageContentMixin,
	TProductContentMixin,
	TTextContentMixin,
	TTypographyMixin,
	TVisibleMixin
} from './mixins';

export type TNode = TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode | TProductNode;
export type TFlatNode = TPageNode | TAboutNode | TLinkNode | TMediaNode | TTextNode | TProductNode;

export interface TFlatPageNode extends Omit<TPageNode, 'children'> {
	children: TNodeId[];
}

export type TNodeId = TId<'node'>;

export interface TBaseNode {
	type: string;
}

export type TNodeType<
	GType extends string,
	GMixins extends readonly TMixin<any, any>[]
> = TBaseNode & {
	type: GType;
} & TMergeMixins<GMixins>;

// =========================================================================
// Nodes
// =========================================================================

export type TProductNode = TNodeType<
	'product',
	[
		TIdMixin,
		TVisibleMixin,
		TProductContentMixin,
		TFillMixin,
		TLayoutMixin,
		TBorderMixin,
		Omit<TTypographyMixin, 'key'> & { key: 'typography' }
	]
>;

export type TAboutNode = TNodeType<
	'about',
	[
		TIdMixin,
		TVisibleMixin,
		TAboutContentMixin,
		TFillMixin,
		TLayoutMixin,
		TBorderMixin,
		TTypographyMixin
	]
>;

export type TLinkNode = TNodeType<
	'link',
	[
		TIdMixin,
		TVisibleMixin,
		TLinkContentMixin,
		TFillMixin,
		TLayoutMixin,
		TBorderMixin,
		TTypographyMixin
	]
>;

export type TTextNode = TNodeType<
	'text',
	[TIdMixin, TVisibleMixin, TTextContentMixin, TFillMixin, TLayoutMixin, TTypographyMixin]
>;

export type TMediaNode = TNodeType<
	'media',
	[TIdMixin, TVisibleMixin, TMediaContentMixin, TFillMixin, TLayoutMixin, TBorderMixin]
>;

export type TPageNode = TNodeType<
	'page',
	[
		TIdMixin,
		TVisibleMixin,
		TPageContentMixin,
		TFillMixin,
		TLayoutMixin,
		TMixin<'children', TNodeId[]>,
		TMixin<
			'childDefaults',
			{
				fill: TPaint;
				spacing: number;
				padding: number;
				font: TFont;
				fontSize: number;
				textColor: TRgba;
				textAlign: 'left' | 'center' | 'right';
				borderRadius: number;
				shadow: boolean;
			}
		>
	]
>;
