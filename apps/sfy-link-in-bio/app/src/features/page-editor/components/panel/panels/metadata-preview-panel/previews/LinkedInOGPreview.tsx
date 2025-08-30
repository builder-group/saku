import React from 'react';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { TOGPreviewProps } from './types';

export const LinkedInOGPreview: React.FC<TOGPreviewProps> = (props) => {
	const { title, image, hostname } = props;

	return (
		<div className="flex items-center gap-3 rounded-lg border border-[#8c8c8c33] px-4 py-3">
			<div
				className="relative w-32 shrink-0 overflow-hidden rounded-lg"
				style={{ aspectRatio: '128/72' }}
			>
				{image != null ? (
					<img src={image} alt={title} className="h-full w-full object-cover" />
				) : (
					<ImagePlaceholder className="aspect-[128/72]" iconClassName="h-6 w-6" />
				)}
			</div>
			<div className="grid gap-2">
				<div className="line-clamp-2 w-full text-sm font-semibold text-[#000000E6]">{title}</div>
				<p className="text-xs text-[#00000099]">{hostname}</p>
			</div>
		</div>
	);
};
