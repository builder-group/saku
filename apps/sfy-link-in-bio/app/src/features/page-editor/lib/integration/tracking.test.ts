import { describe, expect, it } from 'vitest';
import {
	isValidGa4MeasurementId,
	isValidMetaPixelId,
	normalizeGa4MeasurementId,
	normalizeMetaPixelId
} from './tracking';

describe('tracking integration helpers', () => {
	it('normalizes and validates GA4 measurement IDs', () => {
		expect(normalizeGa4MeasurementId('  g-test123  ')).toBe('G-TEST123');
		expect(isValidGa4MeasurementId('G-TEST123')).toBe(true);
		expect(isValidGa4MeasurementId('UA-12345')).toBe(false);
	});

	it('normalizes and validates Meta Pixel IDs', () => {
		expect(normalizeMetaPixelId(' 1234567890 ')).toBe('1234567890');
		expect(isValidMetaPixelId('1234567890')).toBe(true);
		expect(isValidMetaPixelId('pixel_123')).toBe(false);
	});
});
