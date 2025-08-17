import React from 'react';

// Registry to handle cleanup when component gets garbage collected
const registry = new FinalizationRegistry((cleanupRef: React.RefObject<(() => void) | null>) => {
	cleanupRef.current?.(); // cleanup on unmount
});

/**
 * A version of useMemo that allows cleanup using FinalizationRegistry.
 * This ensures proper cleanup even in React Strict Mode where components might mount/unmount multiple times.
 *
 * @see https://stackoverflow.com/questions/66446642/react-usememo-memory-clean
 *
 * @example
 * ```ts
 * const editor = useMemoCleanup(() => {
 *   const content = createState(initialValue);
 *   const unlisten = content.listen(() => {});
 *   return [{ content }, unlisten];
 * }, [initialValue]);
 * ```
 */
export function useMemoCleanup<T>(
	factory: () => [T, () => void],
	deps: React.DependencyList = []
): T {
	const cleanupRef = React.useRef<(() => void) | null>(null); // Holds cleanup function
	const valueRef = React.useRef<T | undefined>(undefined); // Tracks latest value after cleanup
	const unmountRef = React.useRef(false); // GC-triggering candidate, once true triggers registry

	// Register cleanup only once per component instance
	if (!unmountRef.current) {
		unmountRef.current = true;
		registry.register(unmountRef, cleanupRef);
	}

	const value = React.useMemo(() => {
		// Clean up previous value before creating new one
		cleanupRef.current?.();
		cleanupRef.current = null;

		// Create new value and store its cleanup
		const [returned, cleanup] = factory();
		cleanupRef.current = cleanup;
		valueRef.current = returned; // Track latest value for access after cleanup

		return returned;
	}, deps);

	// Return latest value from ref in case previous was cleaned up
	return valueRef.current ?? value;
}
