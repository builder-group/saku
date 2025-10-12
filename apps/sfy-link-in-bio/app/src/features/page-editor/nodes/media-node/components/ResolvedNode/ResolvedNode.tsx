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

	const renderContent = React.useCallback(() => {
		switch (node.bundleType) {
			case 'classic': {
				if (node.content.media == null) {
					return <Skeleton node={node} />;
				}
				return <ClassicContent node={node} media={node.content.media} cx={cx} />;
			}
			default:
				return <Skeleton node={node} />;
		}
	}, [node, cx]);

	return (
		<div ref={ref} {...divProps} className="w-full max-w-md">
			{renderContent()}
		</div>
	);
});
ResolvedMediaNode.displayName = 'ResolvedMediaNode';
