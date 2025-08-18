import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedMediaNode } from '../../types';

export const ImageContent: React.FC<TImageContentProps> = (props) => {
	const {
		node: { content, layout, appearance, fill, stroke, shadow }
	} = props;

	if (content.media == null) {
		return null;
	}

	return (
		<div
			className="relative overflow-hidden"
			style={{
				padding: layout?.padding,
				opacity: appearance.opacity,
				backgroundColor: fill?.paint?.type === 'solid' ? fill?.paint.color : undefined,
				borderRadius: appearance?.borderRadius,
				boxShadow: shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			<img
				src={content.media.url}
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
