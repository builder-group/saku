import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedMediaNode } from '../../types';
import { ImageContent } from './ImageContent';
import { Skeleton } from './Skeleton';

export const ResolvedMediaNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedMediaNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;
	const { content } = node;

	return (
		<div ref={ref} {...divProps} className="w-full max-w-md">
			{(() => {
				switch (content.type) {
					case 'image':
						return <ImageContent node={node} cx={cx} />;
					default:
						return <Skeleton node={node} />;
				}
			})()}
		</div>
	);
});
ResolvedMediaNode.displayName = 'ResolvedMediaNode';
