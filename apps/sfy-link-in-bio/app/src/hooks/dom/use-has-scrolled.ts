import React from 'react';

export function useHasScrolled(threshold = 0) {
	const [hasScrolled, setHasScrolled] = React.useState(false);

	React.useEffect(() => {
		const updatePosition = () => {
			setHasScrolled(window.scrollY > threshold);
		};

		window.addEventListener('scroll', updatePosition);

		updatePosition();

		return () => window.removeEventListener('scroll', updatePosition);
	}, [threshold]);

	return hasScrolled;
}
