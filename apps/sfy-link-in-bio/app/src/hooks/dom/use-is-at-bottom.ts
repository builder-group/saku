import React from 'react';

export function useIsAtBottom(
	threshold = 100,
	scrollWindow: () => Window = () => window,
	scrollDocument: () => Document = () => document
) {
	const [isAtBottom, setIsAtBottom] = React.useState(false);

	React.useEffect(() => {
		const w = scrollWindow();
		const d = scrollDocument();

		const updatePosition = () => {
			const scrollTop = w.scrollY;
			const windowHeight = w.innerHeight;
			const documentHeight = d.documentElement.scrollHeight;

			setIsAtBottom(scrollTop + windowHeight >= documentHeight - threshold);
		};

		w.addEventListener('scroll', updatePosition);

		updatePosition();

		return () => w.removeEventListener('scroll', updatePosition);
	}, [threshold, scrollWindow, scrollDocument]);

	return isAtBottom;
}
