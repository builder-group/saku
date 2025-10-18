import React from 'react';

/**
 * Observe changes to the bounding client rect of an element using a best-effort approach.
 *
 * Based on: https://github.com/html-ng/bounding-client-rect-observer/tree/main
 *
 * @param ref - React ref to the element to observe
 * @param baseValue - Initial bounding rect values to track
 * @param callback - Function called when bounds change
 * @param deps - Optional dependencies for the callback
 * @param scrollWindow - Function that returns the window to observe for scroll events
 *
 * @remarks
 * This hook uses a combination of MutationObserver, ResizeObserver, and scroll events
 * to detect changes to an element's bounding rect. It's a best-effort solution with
 * some known limitations:
 *
 * - CSS animations are not supported
 * - Inline elements affected by text layout may not be fully supported
 * - Assumes static DOM tree (element and ancestors shouldn't be detached)
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useBoundingRectObserver(ref, { width: 0, height: 0 }, (rect) => {
 *   console.log('Bounds changed:', rect);
 * });
 * ```
 */
export function useBoundingRectObserver<
	GElement extends HTMLElement = HTMLDivElement,
	GBoundingRect extends TPartialBoundingRect = TPartialBoundingRect
>(
	ref: React.RefObject<GElement | null>,
	baseValue: GBoundingRect,
	callback: (rect: GBoundingRect) => void,
	deps: React.DependencyList = [],
	scrollWindow: () => Window = () => window
): void {
	const prevRectRef = React.useRef<GBoundingRect>(baseValue);

	const handleBoundingRect = React.useCallback(
		(forceUpdate = false) => {
			const element = ref.current;
			if (element == null) {
				return;
			}

			const prevRect = prevRectRef.current;
			const newRect = element.getBoundingClientRect();
			const updates = { ...prevRect } as GBoundingRect;
			let hasChanges = forceUpdate;

			// Only update properties that exist in baseValue and have changed
			Object.keys(baseValue).forEach((key) => {
				const prop = key as keyof GBoundingRect;
				const newValue = newRect[prop as keyof DOMRect];
				if (prevRect[prop] !== newValue) {
					updates[prop] = newValue as GBoundingRect[keyof GBoundingRect];
					hasChanges = true;
				}
			});

			if (hasChanges) {
				prevRectRef.current = updates;
				callback(updates);
			}
		},
		[ref, ...deps]
	);

	React.useEffect(() => {
		const element = ref.current;
		if (element == null) {
			return;
		}

		const callback = () => {
			handleBoundingRect();
		};

		// Observe style and class changes on the element itself
		const mutationObserver = new MutationObserver(callback);
		mutationObserver.observe(element, {
			attributes: true,
			attributeFilter: ['style', 'class']
		});

		// Observe DOM structure changes on parent (e.g. for reordering detection)
		const parentMutationObserver = new MutationObserver(callback);
		if (element.parentElement) {
			parentMutationObserver.observe(element.parentElement, {
				childList: true, // Detect when children are added/removed/reordered
				subtree: false // Only direct children, not deep changes
			});
		}

		// Observe size changes of element and all ancestors
		const resizeObserver = new ResizeObserver(callback);
		let current: Element | null = element;
		while (current) {
			resizeObserver.observe(current);
			current = current.parentElement;
		}

		// Observe scroll events on element, ancestors, and window
		const scrollElements = new Set<Element>();
		current = element;
		while (current) {
			scrollElements.add(current);
			current.addEventListener('scroll', callback, { passive: true });
			current = current.parentElement;
		}
		const w = scrollWindow();
		w.addEventListener('scroll', callback, { passive: true });

		// Force the initial update to ensure proper initialization during hot reload.
		// This is necessary because prevRectRef persists across hot reloads while the
		// component re-mounts, which can cause the change detection to skip updates
		// since it compares against stale values in the ref.
		handleBoundingRect(true);

		return () => {
			mutationObserver.disconnect();
			parentMutationObserver.disconnect();
			resizeObserver.disconnect();
			scrollElements.forEach((el) => {
				el.removeEventListener('scroll', callback);
			});
			w.removeEventListener('scroll', callback);
		};
	}, [ref, handleBoundingRect, scrollWindow]);
}

interface TPartialBoundingRect {
	left?: number;
	top?: number;
	bottom?: number;
	right?: number;
	width?: number;
	height?: number;
}
