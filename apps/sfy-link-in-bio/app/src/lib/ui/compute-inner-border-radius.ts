export function computeInnerBorderRadius(outerRadius: number, padding: number): number {
	if (outerRadius === 0) {
		return 0;
	}

	const ratio = outerRadius / (outerRadius + padding);
	return outerRadius * Math.pow(ratio, 1.5);
}
