import {
	createId,
	guessMimeType,
	TAssetHash,
	TFlatSite,
	TImageAsset,
	TIntegrationId,
	TNodeId,
	toImageContentType,
	TProduct,
	TProductVariant,
	TShopifyIntegration
} from '@repo/editor';
import {
	getProductsByIds,
	TGetProductsByIdsSuccess
} from '../gql/shopify-admin/queries/products-by-ids';
import { getShopifyOfflineAccessToken } from '../shopify/get-shopify-offline-access-token';

export async function refreshShopifyProducts(
	content: TFlatSite
): Promise<TRefreshShopifyProductsResult> {
	const refreshTargetsByShop = getRefreshTargetsByShop(content);
	if (!refreshTargetsByShop.size) {
		return {
			content,
			updatedNodeIds: [],
			updatedNodes: []
		};
	}

	const updatedNodeIds: TNodeId[] = [];
	const updatedNodes: TRefreshProductChange[] = [];

	for (const { integration, targets } of refreshTargetsByShop.values()) {
		const accessTokenResult = await getShopifyOfflineAccessToken(integration.shopId);
		if (accessTokenResult.isErr()) {
			continue;
		}

		const latestProductsById = await getLatestProductsById({
			productIds: targets.map((target) => target.productId),
			integration,
			accessToken: accessTokenResult.value
		});

		for (const target of targets) {
			const node = content.nodes[target.nodeId];
			if (node == null || node.type !== 'product' || node.content.type !== 'single') {
				continue;
			}

			const existingProduct = node.content.product;
			const latestProduct = latestProductsById.get(target.productId);
			if (existingProduct == null || latestProduct == null) {
				continue;
			}

			const snapshotResult = buildProductSnapshot({
				content,
				existingProduct,
				latestProduct
			});
			const changes = getProductChanges(existingProduct, snapshotResult.product, {
				assetsChanged: snapshotResult.assetsChanged
			});
			if (!changes.length) {
				continue;
			}

			node.content.product = snapshotResult.product;
			updatedNodeIds.push(node.id);
			updatedNodes.push({
				nodeId: node.id,
				productId: target.productId,
				changes
			});
		}
	}

	return {
		content,
		updatedNodeIds,
		updatedNodes
	};
}

interface TRefreshShopifyProductsResult {
	content: TFlatSite;
	updatedNodeIds: TNodeId[];
	updatedNodes: TRefreshProductChange[];
}

interface TRefreshProductChange {
	nodeId: TNodeId;
	productId: string;
	changes: TProductChange[];
}

function getRefreshTargetsByShop(
	content: TFlatSite
): Map<string, { integration: TShopifyIntegration; targets: TRefreshTarget[] }> {
	const refreshTargetsByShop = new Map<
		string,
		{ integration: TShopifyIntegration; targets: TRefreshTarget[] }
	>();

	for (const node of Object.values(content.nodes)) {
		if (node.type !== 'product' || node.content.type !== 'single' || node.content.product == null) {
			continue;
		}

		const integration = resolveShopifyIntegration({
			content,
			integrationId: node.content.integrationId
		});
		if (integration == null) {
			continue;
		}

		const existing = refreshTargetsByShop.get(integration.shopId);
		if (existing != null) {
			existing.targets.push({
				nodeId: node.id,
				productId: node.content.product.id
			});
			continue;
		}

		refreshTargetsByShop.set(integration.shopId, {
			integration,
			targets: [
				{
					nodeId: node.id,
					productId: node.content.product.id
				}
			]
		});
	}

	return refreshTargetsByShop;
}

interface TRefreshTarget {
	nodeId: TNodeId;
	productId: string;
}

async function getLatestProductsById(config: {
	productIds: string[];
	integration: TShopifyIntegration;
	accessToken: string;
}): Promise<Map<string, TLatestProduct>> {
	const { productIds, integration, accessToken } = config;
	const latestProductsById = new Map<string, TLatestProduct>();

	for (const idsChunk of chunk([...new Set(productIds)], 50)) {
		const productsResult = await getProductsByIds(idsChunk, {
			shopId: integration.shopId,
			accessToken
		});
		if (productsResult.isErr()) {
			continue;
		}

		for (const product of productsResult.value.products) {
			latestProductsById.set(product.id, product);
		}
	}

	return latestProductsById;
}

type TLatestProduct = TGetProductsByIdsSuccess['products'][number];

function resolveShopifyIntegration(config: {
	content: TFlatSite;
	integrationId?: TIntegrationId;
}): TShopifyIntegration | null {
	const { content, integrationId } = config;
	const shopifyIntegrations = Object.values(content.integrations).filter(
		(integration): integration is TShopifyIntegration => integration.type === 'shopify'
	);

	if (integrationId != null) {
		const integration = content.integrations[integrationId];
		if (integration?.type === 'shopify') {
			return integration;
		}
	}

	// Only fall back when there is a single Shopify integration so product nodes without
	// integrationId never refresh against the wrong shop
	return shopifyIntegrations.length === 1 ? (shopifyIntegrations[0] ?? null) : null;
}

function buildProductSnapshot(config: {
	content: TFlatSite;
	existingProduct: TProduct;
	latestProduct: TLatestProduct;
}): TBuildProductSnapshotResult {
	const { content, existingProduct, latestProduct } = config;
	let assetsChanged = false;

	const images = latestProduct.images
		.map((image) => {
			const result = ensureImageAsset(content, image.url, image.altText);
			assetsChanged = assetsChanged || result.changed;
			return result.hash;
		})
		.filter((image): image is TAssetHash => image != null);

	const variants = latestProduct.variants.map((variant) => {
		const existingVariant = existingProduct.variants.find((current) => current.id === variant.id);
		const imageResult =
			variant.image != null
				? ensureImageAsset(content, variant.image.url, variant.image.altText)
				: { hash: null, changed: false };
		assetsChanged = assetsChanged || imageResult.changed;

		return {
			...variant,
			price: {
				...variant.price,
				// Preserve editor currency overrides so refresh updates Shopify-backed fields
				// without discarding intentionally customized display currency
				currencyCode: existingVariant?.price.currencyCode ?? variant.price.currencyCode
			},
			image: imageResult.hash ?? undefined
		};
	});

	return {
		product: {
			...existingProduct,
			title: latestProduct.title,
			description: {
				type: 'html',
				value: latestProduct.descriptionHtml
			},
			images,
			options: latestProduct.options,
			variants
		},
		assetsChanged
	};
}

interface TBuildProductSnapshotResult {
	product: TProduct;
	assetsChanged: boolean;
}

function ensureImageAsset(
	content: TFlatSite,
	url: string,
	altText?: string
): TEnsureImageAssetResult {
	const existingAsset = Object.values(content.assets).find(
		(asset): asset is TImageAsset =>
			asset.type === 'image' && asset.storage.type === 'url' && asset.storage.url === url
	);
	if (existingAsset != null) {
		// A single Shopify image URL can be reused by product and variant snapshots, so only
		// backfill missing alt text here. Rewriting shared assets would make refresh non-idempotent
		if (altText != null && existingAsset.altText == null) {
			existingAsset.altText = altText;
			return { hash: existingAsset.hash, changed: true };
		}

		return { hash: existingAsset.hash, changed: false };
	}

	const contentType = toImageContentType(guessMimeType(url));
	if (contentType == null) {
		return { hash: null, changed: false };
	}

	const assetId = createId('asset');
	content.assets[assetId] = {
		id: assetId,
		type: 'image',
		hash: assetId,
		contentType,
		storage: {
			type: 'url',
			url
		},
		altText
	};

	return { hash: assetId, changed: true };
}

interface TEnsureImageAssetResult {
	hash: TAssetHash | null;
	changed: boolean;
}

function getProductChanges(
	existingProduct: TProduct,
	nextProduct: TProduct,
	config: { assetsChanged: boolean }
): TProductChange[] {
	const { assetsChanged } = config;
	const changes: TProductChange[] = [];

	if (existingProduct.title !== nextProduct.title) {
		changes.push('title');
	}
	if (
		serializeDescription(existingProduct.description) !==
		serializeDescription(nextProduct.description)
	) {
		changes.push('description');
	}
	if (serializeImages(existingProduct.images) !== serializeImages(nextProduct.images)) {
		changes.push('images');
	}
	if (serializeOptions(existingProduct.options) !== serializeOptions(nextProduct.options)) {
		changes.push('options');
	}
	if (serializeVariants(existingProduct.variants) !== serializeVariants(nextProduct.variants)) {
		changes.push('variants');
	}
	if (assetsChanged) {
		changes.push('assets');
	}

	return changes;
}

type TProductChange = 'title' | 'description' | 'images' | 'options' | 'variants' | 'assets';

function serializeDescription(productDescription?: TProduct['description']): string {
	return JSON.stringify(
		productDescription != null
			? {
					type: productDescription.type,
					value: productDescription.value
				}
			: null
	);
}

function serializeImages(images: TAssetHash[]): string {
	return JSON.stringify(images);
}

function serializeOptions(options: TProduct['options']): string {
	return JSON.stringify(
		options.map((option) => ({
			name: option.name,
			values: option.values
		}))
	);
}

function serializeVariants(variants: TProductVariant[]): string {
	return JSON.stringify(
		variants.map((variant) => ({
			id: variant.id,
			title: variant.title,
			price: {
				amount: variant.price.amount,
				currencyCode: variant.price.currencyCode
			},
			image: variant.image ?? null,
			selectedOptions: variant.selectedOptions.map((option) => ({
				name: option.name,
				value: option.value
			}))
		}))
	);
}

function chunk<TValue>(values: TValue[], size: number): TValue[][] {
	const chunks: TValue[][] = [];

	for (let index = 0; index < values.length; index += size) {
		chunks.push(values.slice(index, index + size));
	}

	return chunks;
}
