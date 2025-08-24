import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedMediaNode } from '../../types';

export const ImageContent: React.FC<TImageContentProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow }
	} = props;

	if (content.media == null) {
		return null;
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
				src={content.media.src}
				alt={content.media.altText}
				className="h-auto w-full object-cover"
				draggable={false}
				style={{ borderRadius: appearance?.borderRadius }}
			/>
		</div>
	);
};

interface TImageContentProps {
	node: TResolvedMediaNode;
	cx: TResolvedNodeProps<TResolvedMediaNode>['cx'];
}
