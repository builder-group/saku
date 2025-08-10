import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedImageMedia, TResolvedMediaNode } from '../../../../types';

export const ImageContent: React.FC<TImageContentProps> = (props) => {
	const { media, style } = props;

	return (
		<div
			className="relative overflow-hidden"
			style={{
				padding: style.padding,
				backgroundColor: style.backgroundColor,
				borderRadius: style.borderRadius,
				boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			<img
				src={media.url}
				alt={media.altText}
				className="h-auto w-full object-cover"
				draggable={false}
				style={{ borderRadius: style.borderRadius }}
			/>
		</div>
	);
};

interface TImageContentProps {
	media: TResolvedImageMedia;
	style: TResolvedMediaNode['style'];
	cx: TResolvedNodeProps<TResolvedMediaNode>['cx'];
}
