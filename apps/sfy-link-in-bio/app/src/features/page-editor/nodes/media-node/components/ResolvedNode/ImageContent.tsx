import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedImageMedia, TResolvedMediaNode } from '../../types';

export const ImageContent: React.FC<TImageContentProps> = (props) => {
	const {
		media,
		node: { layout, appearance, fill, stroke, shadow }
	} = props;

	return (
		<div
			className="relative overflow-hidden"
			style={{
				padding: layout?.padding,
				backgroundColor: fill?.paint.type === 'solid' ? fill?.paint.color : undefined,
				borderRadius: appearance?.borderRadius,
				boxShadow: shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			<img
				src={media.url}
				alt={media.altText}
				className="h-auto w-full object-cover"
				draggable={false}
				style={{ borderRadius: appearance?.borderRadius }}
			/>
		</div>
	);
};

interface TImageContentProps {
	media: TResolvedImageMedia;
	node: TResolvedMediaNode;
	cx: TResolvedNodeProps<TResolvedMediaNode>['cx'];
}
