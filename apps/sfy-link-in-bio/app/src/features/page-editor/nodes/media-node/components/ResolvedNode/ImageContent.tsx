import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedImageMediaNodeContent, TResolvedMediaNode } from '../../types';

export const ImageContent: React.FC<TImageContentProps> = (props) => {
	const {
		node: { autoLayout, appearance, fill, stroke, shadow, image },
		media
	} = props;

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
	node: TResolvedMediaNode<TResolvedImageMediaNodeContent>;
	media: NonNullable<TResolvedImageMediaNodeContent['media']>;
	cx: TResolvedNodeProps<TResolvedMediaNode<TResolvedImageMediaNodeContent>>['cx'];
}
