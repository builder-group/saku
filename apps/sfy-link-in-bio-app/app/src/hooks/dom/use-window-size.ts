import React from 'react';

export function useWindowSize(): TWindowSize | null {
	const [size, setSize] = React.useState<TWindowSize | null>(null);

	React.useLayoutEffect(() => {
		const handleResize = () => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return size;
}

export interface TWindowSize {
	width: number;
	height: number;
}
