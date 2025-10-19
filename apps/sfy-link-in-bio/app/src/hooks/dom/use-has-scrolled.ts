import React from 'react';

export function useHasScrolled(threshold = 0, scrollWindow: () => Window = () => window) {
	const [hasScrolled, setHasScrolled] = React.useState(false);

	React.useEffect(() => {
		const w = scrollWindow();

		const updatePosition = () => {
			setHasScrolled(w.scrollY > threshold);
		};

		w.addEventListener('scroll', updatePosition);

		updatePosition();

		return () => w.removeEventListener('scroll', updatePosition);
	}, [threshold, scrollWindow]);

	return hasScrolled;
}
