import React from 'react';
import type { TIconProps } from './types';

export const PatreonIcon = React.forwardRef<SVGSVGElement, TIconProps>((props, ref) => {
	return (
		<svg
			ref={ref}
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M2 2.37695H5.52622V21.623H2V2.37695Z" />
			<path d="M22 9.59124C22 13.5756 18.7701 16.8055 14.7857 16.8055C10.8014 16.8055 7.57143 13.5756 7.57143 9.59124C7.57143 5.6069 10.8014 2.37695 14.7857 2.37695C18.7701 2.37695 22 5.6069 22 9.59124Z" />
		</svg>
	);
});
PatreonIcon.displayName = 'Patreon Icon';
