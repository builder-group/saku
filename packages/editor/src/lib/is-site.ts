import { TFlatSite, TSite } from '../types';

export function isFlatSite(value: unknown): value is TFlatSite {
	return (
		value != null &&
		typeof value === 'object' &&
		'rootId' in value &&
		'nodes' in value &&
		'version' in value
	);
}

export function isHierarchicalSite(value: unknown): value is TSite {
	return (
		value != null &&
		typeof value === 'object' &&
		'root' in value &&
		!('rootId' in value) &&
		'version' in value
	);
}

