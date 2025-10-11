import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedMediaNode } from '../../types';
import { ClassicContent } from './ClassicContent';
import { Skeleton } from './Skeleton';

export const ResolvedMediaNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedMediaNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;
	const { content } = node;

	const renderContent = React.useCallback(() => {
		switch (content.type) {
			case 'classic': {
				if (content.media == null) {
					return <Skeleton node={node} />;
				}
				return <ClassicContent node={node} media={content.media} cx={cx} />;
			}
			default:
				return <Skeleton node={node} />;
		}
	}, [content, node, cx]);

	return (
		<div ref={ref} {...divProps} className="w-full max-w-md">
			{renderContent()}
		</div>
	);
});
ResolvedMediaNode.displayName = 'ResolvedMediaNode';
