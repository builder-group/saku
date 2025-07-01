import { TAssetHash } from './site-types';

export function getFontHash(font: { family: string; weight?: number; style?: string }): TAssetHash {
	return `${font.family}-${font.weight || 400}-${font.style || 'normal'}`
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '-') as TAssetHash;
}
