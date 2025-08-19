import { TFlatNode } from '@repo/editor';
import { TResolvedNode } from '../../types';

export function isNodeVisible(node: TFlatNode | TResolvedNode): boolean {
	return !('appearance' in node) || node.appearance.visible;
}
