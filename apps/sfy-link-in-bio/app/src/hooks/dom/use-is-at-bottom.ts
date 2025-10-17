import React from 'react';

export function useIsAtBottom(
	threshold = 100,
	scrollWindow: Window = window,
	scrollDocument: Document = document
) {
	const [isAtBottom, setIsAtBottom] = React.useState(false);

	React.useEffect(() => {
		const updatePosition = () => {
			const scrollTop = scrollWindow.scrollY;
			const windowHeight = scrollWindow.innerHeight;
			const documentHeight = scrollDocument.documentElement.scrollHeight;

			setIsAtBottom(scrollTop + windowHeight >= documentHeight - threshold);
		};

		window.addEventListener('scroll', updatePosition);

		updatePosition();

		return () => window.removeEventListener('scroll', updatePosition);
	}, [threshold, scrollWindow, scrollDocument]);

	return isAtBottom;
}
