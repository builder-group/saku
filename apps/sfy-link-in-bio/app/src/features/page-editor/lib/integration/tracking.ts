export function normalizeGa4MeasurementId(value: string | undefined): string | undefined {
	const trimmedValue = value?.trim().toUpperCase();
	return trimmedValue != null && trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function isValidGa4MeasurementId(value: string | undefined): value is string {
	return value != null && /^G-[A-Z0-9]+$/.test(value);
}

export function normalizeMetaPixelId(value: string | undefined): string | undefined {
	const trimmedValue = value?.trim();
	return trimmedValue != null && trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function isValidMetaPixelId(value: string | undefined): value is string {
	return value != null && /^[0-9]+$/.test(value);
}
