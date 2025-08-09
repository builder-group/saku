import { TLinkVariant } from '@repo/editor';
import { ShopifyGlobal } from '@shopify/app-bridge-react';
import { TPageEditor } from '../../../../../lib';
import { linkVariantMetadataMap, TVariantType } from '../environment';

/**
 * Migrates from one variant to another, preserving common fields
 */
export async function migrateVariant(
	targetType: TVariantType,
	config: TMigrateVariantConfig
): Promise<TLinkVariant | null> {
	const { url, currentVariant, editor, shopify } = config;
	const targetMetadata = linkVariantMetadataMap[targetType];
	if (targetMetadata == null) {
		return null;
	}

	const commonFields = linkVariantMetadataMap[currentVariant.type].extractCommonFields(
		currentVariant as any
	);

	return await targetMetadata.createVariant({
		url,
		common: commonFields,
		editor,
		shopify
	});
}

interface TMigrateVariantConfig {
	url: string;
	currentVariant: TLinkVariant;
	editor: TPageEditor;
	shopify: ShopifyGlobal;
}
