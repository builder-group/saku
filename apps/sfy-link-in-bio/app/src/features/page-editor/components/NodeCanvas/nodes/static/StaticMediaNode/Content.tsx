import React from 'react';
import { TResolvedMediaNode } from '../../../../../types';
import { TStaticNodeProps } from '../../types';

export const Content: React.FC<TContentProps> = (props) => {
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

interface TContentProps {
	media: NonNullable<TResolvedMediaNode['content']['media']>;
	style: TResolvedMediaNode['style'];
	cx: TStaticNodeProps<TResolvedMediaNode>['cx'];
}
