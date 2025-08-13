import { TId } from '../lib/id';
import { TAssetHash, TIntegrationId, TLinkVariant, TMedia, TSocialLink } from '../types';
import { TChildrenMixin, TFlatChildrenMixin, TIdMixin, TMergeMixins, TMixin } from './mixin';
import { TBorderStyle, TFillStyle, TLayoutStyle, TShadowStyle, TTypographyStyle } from './style';

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
		TChildrenMixin,
		TMixin<
			'content',
			{
				metadata: {
					title?: string;
					description?: string;
					image?: TAssetHash;
				};
			}
		>,
		TMixin<
			'style',
			{
				spacing: number;
			} & TFillStyle
		>,
		TMixin<
			'childDefaults',
			{
				style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
			}
		>
	]
>;

export interface TFlatPageNode extends Omit<TPageNode, 'children'>, TFlatChildrenMixin {}

export type TAboutNode = TNodeType<
	'about',
	[
		TIdMixin,
		TMixin<
			'content',
			{
				name: string;
				bio?: string;
				profilePicture?: TAssetHash;
				socialLinks: TSocialLink[];
			}
		>,
		TMixin<
			'style',
			{
				style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
			}
		>
	]
>;

export type TLinkNode = TNodeType<
	'link',
	[
		TIdMixin,
		TMixin<
			'content',
			{
				url: string;
				variant: TLinkVariant;
			}
		>,
		TMixin<
			'style',
			{
				style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
			}
		>
	]
>;

export type TMediaNode = TNodeType<
	'media',
	[
		TIdMixin,
		TMixin<
			'content',
			{
				media?: TMedia;
			}
		>,
		TMixin<
			'style',
			{
				style: TFillStyle & TLayoutStyle & TBorderStyle & TShadowStyle;
			}
		>
	]
>;

export type TTextNode = TNodeType<
	'text',
	[
		TIdMixin,
		TMixin<
			'content',
			{
				text: string;
			}
		>,
		TMixin<
			'style',
			{
				style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
			}
		>
	]
>;

export type TProductNode = TNodeType<
	'product',
	[
		TIdMixin,
		TMixin<
			'content',
			{
				product?: {
					id: string;
					title: string;
					images: TAssetHash[];
					options: { name: string; values: string[] }[];
					variants: {
						id: string;
						title: string;
						price: { amount: string; currencyCode: string };
						image?: TAssetHash;
						selectedOptions: { name: string; value: string }[];
					}[];
				};
				integrationId?: TIntegrationId;
			}
		>,
		TMixin<
			'style',
			{
				style: TFillStyle & TLayoutStyle & TTypographyStyle & TBorderStyle & TShadowStyle;
			}
		>
	]
>;
