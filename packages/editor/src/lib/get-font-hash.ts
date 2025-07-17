import { TAssetHash, TFont } from '../types';

export function getFontHash(font: TFont): TAssetHash {
	return `${font.family}-${font.weight || 400}-${font.style || 'normal'}`
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '-');
}
