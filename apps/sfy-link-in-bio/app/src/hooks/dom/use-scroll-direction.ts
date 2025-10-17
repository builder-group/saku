import React from 'react';

// https://www.codemzy.com/blog/react-sticky-header-disappear-scroll
export function useScrollDirection() {
	const [scrollDirection, setScrollDirection] = React.useState<TScrollDirection | null>(null);

	React.useEffect(() => {
		let lastScrollY = window.scrollY;

		const updateScrollDirection = () => {
			const scrollY = window.scrollY;
			const direction: TScrollDirection = scrollY > lastScrollY ? 'down' : 'up';

			// Only update if scroll difference is greater than 10px
			if (
				scrollDirection !== direction &&
				(scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
			) {
				setScrollDirection(direction);
			}
			lastScrollY = scrollY > 0 ? scrollY : 0;
		};

		window.addEventListener('scroll', updateScrollDirection);
		return () => {
			window.removeEventListener('scroll', updateScrollDirection);
		};
	}, [scrollDirection]);

	return scrollDirection;
}

type TScrollDirection = 'up' | 'down';
