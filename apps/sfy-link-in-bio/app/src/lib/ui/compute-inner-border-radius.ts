export function computeInnerBorderRadius(
	outerRadius: number,
	verticalPadding: number,
	horizontalPadding: number
): number {
	const padding = Math.max(verticalPadding, horizontalPadding);
	const ratio = outerRadius / (outerRadius + padding);
	return outerRadius * Math.pow(ratio, 1.5);
}
