import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedClassicBundle } from '../bundles';
import { TResolvedProductNode } from '../types';
import { Skeleton } from './Skeleton';

export const ResolvedProductNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedProductNode>
>((props, ref) => {
	const { node, cx } = props;

	switch (node.bundleType) {
		case 'classic':
			if (node.content.product == null) {
				return <Skeleton ref={ref} node={node} />;
			}
			return <ResolvedClassicBundle ref={ref} node={node} product={node.content.product} cx={cx} />;
		default:
			return <Skeleton ref={ref} node={node} />;
	}
});
ResolvedProductNode.displayName = 'ResolvedProductNode';
