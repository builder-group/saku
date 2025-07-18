export function mutateWithReferenceUpdate<T extends object>(
	obj: T,
	updateFn: (draft: T) => void
): T {
	updateFn(obj); // mutate in place
	return { ...obj }; // return new reference
}
