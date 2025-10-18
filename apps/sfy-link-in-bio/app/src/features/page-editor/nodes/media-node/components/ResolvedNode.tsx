import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedClassicBundle } from '../bundles';
import { TResolvedMediaNode } from '../types';
import { Skeleton } from './Skeleton';

export const ResolvedMediaNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedMediaNode>
>((props, ref) => {
	const { node, ...rest } = props;

	switch (node.bundleType) {
		case 'classic': {
			if (node.content.media == null) {
				return <Skeleton ref={ref} node={node} />;
			}
			return <ResolvedClassicBundle ref={ref} node={node} {...rest} media={node.content.media} />;
		}
		default:
			return <Skeleton ref={ref} node={node} />;
	}
});
ResolvedMediaNode.displayName = 'ResolvedMediaNode';
