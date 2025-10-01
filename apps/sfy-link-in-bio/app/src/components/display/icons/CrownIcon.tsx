import React from 'react';
import type { TIconProps } from './types';

export const CrownIcon = React.forwardRef<SVGSVGElement, TIconProps>((props, ref) => {
	return (
		<svg
			ref={ref}
			fill="currentColor"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M18.2657 16.0613L19 8.22383L15.4583 11.7677L12.2503 6L9.04238 11.7677L5 8.22383L6.23682 16.0613C6.28763 16.3248 6.42959 16.5626 6.63835 16.7338C6.84711 16.9051 7.10965 16.9992 7.38093 17H17.1197C17.3916 17.0001 17.6551 16.9063 17.8646 16.735C18.0741 16.5637 18.2148 16.3254 18.2657 16.0613Z"
			/>
		</svg>
	);
});
CrownIcon.displayName = 'Crown Icon';
