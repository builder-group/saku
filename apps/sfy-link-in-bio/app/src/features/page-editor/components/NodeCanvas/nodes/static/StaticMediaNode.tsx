import React from 'react';
import { TResolvedMediaNode } from '../../../../types';

export const StaticMediaNode = React.forwardRef<HTMLDivElement, TStaticMediaNodeProps>(
	(props, ref) => {
		const { node, ...divProps } = props;

		// Only handle image type for now
		if (node.media.type !== 'image') {
			return null;
		}

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				<div
					className="relative overflow-hidden"
					style={{
						padding: node.style.padding,
						margin: node.style.margin,
						backgroundColor: node.style.backgroundColor,
						borderRadius: node.style.borderRadius,
						boxShadow: node.style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
					}}
				>
					{node.media.url != null ? (
						<img
							src={node.media.url}
							alt={node.media.altText ?? ''}
							className="h-auto w-full object-cover"
							draggable={false}
							style={{ borderRadius: node.style.borderRadius }}
						/>
					) : (
						<div
							className="flex aspect-[16/9] w-full items-center justify-center bg-gray-100 text-gray-400"
							style={{ borderRadius: node.style.borderRadius }}
						>
							No Image
						</div>
					)}
				</div>
			</div>
		);
	}
);
StaticMediaNode.displayName = 'StaticMediaNode';

interface TStaticMediaNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TResolvedMediaNode;
}
