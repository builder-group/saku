import React from 'react';
import { TResolvedMediaNode } from '../../../../types';
import { TStaticNodeProps } from '../types';

export const StaticMediaNode = React.forwardRef<
	HTMLDivElement,
	TStaticNodeProps<TResolvedMediaNode>
>((props, ref) => {
	const {
		node: { content, style },
		...divProps
	} = props;

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			<div
				className="relative overflow-hidden"
				style={{
					padding: style.padding,
					backgroundColor: style.backgroundColor,
					borderRadius: style.borderRadius,
					boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
				}}
			>
				{content.media?.url != null ? (
					<img
						src={content.media.url}
						alt={content.media.altText ?? ''}
						className="h-auto w-full object-cover"
						draggable={false}
						style={{ borderRadius: style.borderRadius }}
					/>
				) : (
					<div
						className="flex aspect-[16/9] w-full items-center justify-center bg-gray-100 text-gray-400"
						style={{ borderRadius: style.borderRadius }}
					>
						No Image
					</div>
				)}
			</div>
		</div>
	);
});
StaticMediaNode.displayName = 'StaticMediaNode';
