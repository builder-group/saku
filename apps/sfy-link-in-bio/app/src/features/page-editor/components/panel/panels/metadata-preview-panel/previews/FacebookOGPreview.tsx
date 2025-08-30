import React from 'react';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { TOGPreviewProps } from './types';

export const FacebookOGPreview: React.FC<TOGPreviewProps> = (props) => {
	const { title, description, image, hostname } = props;

	return (
		<div>
			<div className="relative border border-neutral-300">
				{image != null ? (
					<img src={image} alt={title} className="aspect-[1200/630] h-full w-full object-cover" />
				) : (
					<ImagePlaceholder className="aspect-[1200/630]" />
				)}
				<div className="grid gap-1 border-t border-neutral-300 bg-[#f2f3f5] p-2">
					<p className="text-xs text-[#606770] uppercase">{hostname}</p>
					<div className="truncate text-xs font-semibold text-[#1d2129]">{title}</div>
					<div className="mb-1 line-clamp-2 w-full text-xs text-[#606770]">{description}</div>
				</div>
			</div>
		</div>
	);
};
