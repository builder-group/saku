import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedImageMediaNodeComposition } from '../../types';
import { Skeleton } from './Skeleton';

export const ImageContent: React.FC<TImageContentProps> = (props) => {
	const { node } = props;
	const { autoLayout, appearance, fill, stroke, shadow, image } = node;

	const media = node.content.media;
	if (media == null) {
		return <Skeleton node={node} />;
	}

	return (
		<div
			className="relative overflow-hidden"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			<img
				src={media.src}
				alt={media.altText}
				className="h-auto w-full object-cover"
				draggable={false}
				style={image.styles}
			/>
		</div>
	);
};

interface TImageContentProps {
	node: TResolvedImageMediaNodeComposition;
	cx: TResolvedNodeProps<TResolvedImageMediaNodeComposition>['cx'];
}
