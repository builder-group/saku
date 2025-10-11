import { bundleMetadata, TBundleType } from '../environment';

export function getApplicableBundle(url: string): TBundleType[] {
	return bundleMetadata
		.filter((variant) => variant.isApplicable(url))
		.map((variant) => variant.type);
}
