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

	const renderContent = React.useCallback(() => {
		switch (content.type) {
			case 'image': {
				if (node.content.media == null) {
					return <Skeleton node={node} />;
				}
				return <ImageContent node={node} media={node.content.media} cx={cx} />;
			}
			default:
				return <Skeleton node={node} />;
		}
	}, [content.type, node, cx]);

	return (
		<div ref={ref} {...divProps} className="w-full max-w-md">
			{renderContent()}
		</div>
	);
});
ResolvedMediaNode.displayName = 'ResolvedMediaNode';
