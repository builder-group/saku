import React from 'react';

export function useResizeObserver<GElement extends HTMLElement | null>(
	ref: React.RefObject<GElement>,
	callback: () => void,
	deps: React.DependencyList = []
) {
	React.useEffect(() => {
		if (ref.current == null) {
			return;
		}

		const observer = new ResizeObserver(() => callback());
		observer.observe(ref.current);

		return () => {
			observer.disconnect();
		};
	}, [ref, ...deps]);
}
