import React from 'react';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { TOGPreviewProps } from './types';

export const XOGPreview: React.FC<TOGPreviewProps> = (props) => {
	const { title, image, hostname } = props;

	return (
		<div>
			<div className="group relative overflow-hidden rounded-2xl border border-neutral-300">
				{image != null ? (
					<img src={image} alt={title} className="aspect-[1200/630] h-full w-full object-cover" />
				) : (
					<ImagePlaceholder className="aspect-[1200/630]" />
				)}
				<div className="absolute bottom-2 left-0 w-full px-2">
					<div className="w-fit max-w-full rounded bg-black/[0.77] px-1.5 py-px">
						<span className="block max-w-sm truncate text-xs text-white">{title}</span>
					</div>
				</div>
			</div>
			<p className="mt-1 text-xs text-[#606770]">From {hostname}</p>
		</div>
	);
};
