import React from 'react';
import type { TIconProps } from './types';

export const LinkedInIcon = React.forwardRef<SVGSVGElement, TIconProps>((props, ref) => {
	return (
		<svg
			ref={ref}
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.995 22.029V7.84H1.279v14.189h4.716ZM3.637 5.903c1.644 0 2.668-1.09 2.668-2.451C6.275 2.059 5.281 1 3.668 1S1 2.06 1 3.452c0 1.361 1.023 2.45 2.606 2.45h.03Zm4.967 16.126h4.716v-7.924c0-.424.03-.848.155-1.15.341-.848 1.117-1.725 2.42-1.725 1.707 0 2.39 1.3 2.39 3.208v7.59H23v-8.135c0-4.358-2.327-6.386-5.43-6.386-2.544 0-3.66 1.422-4.281 2.39h.031V7.84H8.604c.062 1.331 0 14.189 0 14.189Z"
			/>
		</svg>
	);
});
LinkedInIcon.displayName = 'LinkedIn Icon';
