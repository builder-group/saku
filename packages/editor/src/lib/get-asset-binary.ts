import { TAsset } from '../types';

/**
 * Get binary data from an asset
 * @param asset The asset to get binary data from
 * @returns Promise resolving to Uint8Array of binary data, or null if failed
 */
export async function getAssetBinary(asset: TAsset): Promise<Uint8Array | null> {
	switch (asset.storage.type) {
		case 'embedded': {
			// Convert base64 to Uint8Array
			const binaryString = atob(asset.storage.data);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			return bytes;
		}

		case 'url': {
			try {
				const response = await fetch(asset.storage.url);
				if (!response.ok) {
					return null;
				}
				const arrayBuffer = await response.arrayBuffer();
				return new Uint8Array(arrayBuffer);
			} catch {
				return null;
			}
		}
		default:
			return null;
	}
}
