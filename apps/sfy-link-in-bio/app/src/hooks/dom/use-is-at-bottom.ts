import React from 'react';

export function useIsAtBottom(threshold = 100) {
	const [isAtBottom, setIsAtBottom] = React.useState(false);

	React.useEffect(() => {
		const updatePosition = () => {
			const scrollTop = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			setIsAtBottom(scrollTop + windowHeight >= documentHeight - threshold);
		};

		window.addEventListener('scroll', updatePosition);

		updatePosition();

		return () => window.removeEventListener('scroll', updatePosition);
	}, [threshold]);

	return isAtBottom;
}
