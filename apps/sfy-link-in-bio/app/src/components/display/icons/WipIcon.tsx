import React from 'react';
import type { TIconProps } from './types';

export const WipIcon = React.forwardRef<SVGSVGElement, TIconProps>((props, ref) => {
	return (
		<svg
			ref={ref}
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M12 1L1 23H12L23 1H12Z" />
		</svg>
	);
});
WipIcon.displayName = 'Wip Icon';
