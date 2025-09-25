export interface TPreventDefault {
	preventDefault: true;
}

export function isPreventDefault(result: unknown): result is TPreventDefault {
	return (
		result != null &&
		typeof result === 'object' &&
		'preventDefault' in result &&
		result.preventDefault === true
	);
}
