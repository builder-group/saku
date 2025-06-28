import React from 'react';
import type { TIconProps } from './types';

export const SpotifyIcon = React.forwardRef<SVGSVGElement, TIconProps>((props, ref) => {
	return (
		<svg
			ref={ref}
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M11 0C4.925 0 0 4.925 0 11s4.925 11 11 11c6.076 0 11-4.925 11-11S17.076 0 11 0Zm5.044 15.865a.685.685 0 0 1-.943.227c-2.582-1.577-5.834-1.935-9.663-1.06a.686.686 0 0 1-.305-1.337c4.19-.958 7.785-.545 10.684 1.227.323.198.426.62.227.943Zm1.347-2.996a.857.857 0 0 1-1.18.283c-2.956-1.817-7.464-2.344-10.96-1.282a.859.859 0 0 1-1.071-.571.859.859 0 0 1 .572-1.07c3.995-1.212 8.96-.625 12.356 1.462a.856.856 0 0 1 .283 1.178Zm.115-3.118c-3.545-2.106-9.394-2.3-12.779-1.273A1.029 1.029 0 1 1 4.13 6.51c3.885-1.18 10.345-.951 14.426 1.472a1.028 1.028 0 1 1-1.05 1.77Z" />
		</svg>
	);
});
SpotifyIcon.displayName = 'Spotify Icon';
