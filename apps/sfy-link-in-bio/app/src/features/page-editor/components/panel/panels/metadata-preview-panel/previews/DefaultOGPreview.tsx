import React from 'react';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { TOGPreviewProps } from './types';

export const DefaultOGPreview: React.FC<TOGPreviewProps> = (props) => {
	const { title, description, image } = props;

	return (
		<div>
			<div className="group relative overflow-hidden rounded-md border border-neutral-300">
				{image != null ? (
					<img src={image} alt={title} className="aspect-[1200/630] h-full w-full object-cover" />
				) : (
					<ImagePlaceholder className="aspect-[1200/630]" />
				)}
			</div>
			<div className="mt-4 line-clamp-2 w-full text-xs font-medium text-neutral-700">{title}</div>
			<div className="mt-1.5 line-clamp-2 w-full text-xs text-neutral-700/80">{description}</div>
		</div>
	);
};
