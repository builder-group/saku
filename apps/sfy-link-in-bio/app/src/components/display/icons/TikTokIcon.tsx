import React from 'react';
import type { TIconProps } from './types';

export const TikTokIcon = React.forwardRef<SVGSVGElement, TIconProps>((props, ref) => {
	return (
		<svg
			ref={ref}
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M21.248 10.014c-1.932.043-3.735-.558-5.28-1.674v7.684c0 2.92-1.803 5.495-4.55 6.525a6.923 6.923 0 0 1-7.684-1.932 7.03 7.03 0 0 1-.901-7.941c1.373-2.533 4.206-3.95 7.125-3.563v3.863a3.241 3.241 0 0 0-3.605 1.16c-.773 1.159-.773 2.66.043 3.777.815 1.116 2.275 1.588 3.562 1.159a3.222 3.222 0 0 0 2.233-3.048V1h3.777c0 .343 0 .644.086.987a5.076 5.076 0 0 0 2.318 3.434c.816.558 1.846.859 2.876.859v3.734Z" />
		</svg>
	);
});
TikTokIcon.displayName = 'TikTok Icon';
