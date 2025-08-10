import { linkVariantMetadata, TVariantType } from '../environment';

export function getApplicableVariants(url: string): { label: string; value: TVariantType }[] {
	return linkVariantMetadata
		.filter((variant) => variant.isApplicable(url))
		.map((variant) => ({
			label: variant.label,
			value: variant.type
		}));
}
