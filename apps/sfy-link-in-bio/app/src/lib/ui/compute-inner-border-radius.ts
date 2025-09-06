export function computeInnerBorderRadius(
	outerRadius: number,
	verticalPadding: number,
	horizontalPadding: number
): number {
	if (outerRadius === 0) {
		return 0;
	}

	const padding = Math.max(verticalPadding, horizontalPadding);
	const ratio = outerRadius / (outerRadius + padding);
	return outerRadius * Math.pow(ratio, 1.5);
}
