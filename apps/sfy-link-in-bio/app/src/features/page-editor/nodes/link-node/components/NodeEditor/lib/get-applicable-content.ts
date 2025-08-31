import { contentMetadata, TContentType } from '../environment';

export function getApplicableContent(url: string): { label: string; value: TContentType }[] {
	return contentMetadata
		.filter((variant) => variant.isApplicable(url))
		.map((variant) => ({
			label: variant.label,
			value: variant.type
		}));
}
