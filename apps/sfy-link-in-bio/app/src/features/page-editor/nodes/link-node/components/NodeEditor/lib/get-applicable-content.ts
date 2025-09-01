import { contentMetadata, TContentType } from '../environment';

export function getApplicableContent(url: string): TContentType[] {
	return contentMetadata
		.filter((variant) => variant.isApplicable(url))
		.map((variant) => variant.type);
}
