import React from 'react';

export function useHasScrolled(threshold = 0, scrollWindow: Window = window) {
	const [hasScrolled, setHasScrolled] = React.useState(false);

	React.useEffect(() => {
		const updatePosition = () => {
			setHasScrolled(scrollWindow.scrollY > threshold);
		};

		scrollWindow.addEventListener('scroll', updatePosition);

		updatePosition();

		return () => scrollWindow.removeEventListener('scroll', updatePosition);
	}, [threshold, scrollWindow]);

	return hasScrolled;
}
