import React from 'react';
import type { TIconProps } from './types';

export const InstagramIcon = React.forwardRef<SVGSVGElement, TIconProps>((props, ref) => {
	return (
		<svg
			ref={ref}
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g clipPath="url(#a)">
				<path d="M12 2.98c2.94 0 3.287.014 4.443.065 1.074.048 1.654.228 2.041.378.511.198.88.439 1.263.821.387.387.623.752.821 1.263.15.387.33.972.378 2.041.052 1.16.064 1.509.064 4.443 0 2.94-.012 3.287-.064 4.443-.047 1.075-.228 1.655-.378 2.041a3.412 3.412 0 0 1-.82 1.264 3.385 3.385 0 0 1-1.264.82c-.387.15-.971.331-2.041.378-1.16.052-1.508.065-4.443.065-2.94 0-3.287-.013-4.443-.064-1.074-.048-1.654-.228-2.041-.379a3.403 3.403 0 0 1-1.263-.82 3.384 3.384 0 0 1-.821-1.264c-.15-.386-.33-.97-.378-2.04-.052-1.16-.065-1.509-.065-4.444 0-2.939.013-3.287.065-4.443.047-1.074.228-1.654.378-2.04.198-.512.438-.881.82-1.264a3.383 3.383 0 0 1 1.264-.82c.387-.15.971-.331 2.041-.379 1.156-.051 1.504-.064 4.443-.064ZM12 1c-2.986 0-3.36.013-4.533.064-1.169.052-1.972.241-2.669.512a5.369 5.369 0 0 0-1.95 1.272 5.39 5.39 0 0 0-1.272 1.946c-.27.7-.46 1.5-.512 2.669C1.013 8.64 1 9.013 1 12c0 2.986.013 3.36.064 4.533.052 1.169.241 1.973.512 2.669.283.726.657 1.34 1.272 1.95.61.61 1.224.989 1.946 1.268.7.27 1.5.46 2.669.511 1.173.052 1.546.065 4.533.065 2.986 0 3.36-.013 4.533-.065 1.169-.051 1.972-.24 2.668-.511a5.376 5.376 0 0 0 1.947-1.268 5.37 5.37 0 0 0 1.267-1.946c.271-.7.46-1.5.512-2.668.051-1.174.064-1.547.064-4.534 0-2.986-.013-3.36-.064-4.533-.052-1.169-.241-1.972-.512-2.668a5.152 5.152 0 0 0-1.259-1.955 5.377 5.377 0 0 0-1.946-1.268c-.7-.27-1.5-.46-2.668-.511C15.36 1.013 14.986 1 12 1Z" />
				<path d="M12 6.35a5.65 5.65 0 1 0 .001 11.301A5.65 5.65 0 0 0 12 6.35Zm0 9.315a3.666 3.666 0 1 1 .001-7.331A3.666 3.666 0 0 1 12 15.665Zm7.193-9.539a1.32 1.32 0 1 1-2.639 0 1.32 1.32 0 0 1 2.639 0Z" />
			</g>
			<defs>
				<clipPath id="a">
					<path fill="#fff" d="M1 1h22v22H1z" />
				</clipPath>
			</defs>
		</svg>
	);
});
InstagramIcon.displayName = 'Instagram Icon';

export const InstagramBackground = React.forwardRef<SVGSVGElement, TIconProps>((props, ref) => {
	return (
		<svg ref={ref} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
			<mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse">
				<path fill="#000" d="M0 0h24v24H0z" />
			</mask>
			<g mask="url(#a)">
				<path fill="url(#b)" d="M0 0h24v24H0z" />
				<path fill="url(#c)" d="M0 0h24v24H0z" />
			</g>
			<defs>
				<radialGradient
					id="b"
					cx="0"
					cy="0"
					r="1"
					gradientTransform="matrix(0 -23.7858 22.1226 0 6.375 25.849)"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#FD5" />
					<stop offset=".1" stopColor="#FD5" />
					<stop offset=".5" stopColor="#FF543E" />
					<stop offset="1" stopColor="#C837AB" />
				</radialGradient>
				<radialGradient
					id="c"
					cx="0"
					cy="0"
					r="1"
					gradientTransform="rotate(78.681 -3.065 -1.588) scale(10.6323 43.827)"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#3771C8" />
					<stop offset=".128" stopColor="#3771C8" />
					<stop offset="1" stopColor="#60F" stopOpacity="0" />
				</radialGradient>
			</defs>
		</svg>
	);
});
InstagramBackground.displayName = 'Instagram Background';
