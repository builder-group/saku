import { TSolidPaint } from '../types';
import { hexToRgba } from './color';

export function hexToPaint(hex: string): TSolidPaint {
	return {
		type: 'solid',
		color: hexToRgba(hex)
	};
}
