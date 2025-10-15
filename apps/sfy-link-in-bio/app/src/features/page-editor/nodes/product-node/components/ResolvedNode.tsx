import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedClassicBundle } from '../bundles';
import { TResolvedProductNode } from '../types';
import { Skeleton } from './Skeleton';

export const ResolvedProductNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedProductNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;

	const renderBundle = React.useCallback(() => {
		switch (node.bundleType) {
			case 'classic':
				if (node.content.product == null) {
					return <Skeleton node={node} />;
				}
				return <ResolvedClassicBundle node={node} product={node.content.product} cx={cx} />;
			default:
				return null;
		}
	}, [node, cx]);

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			{renderBundle()}
		</div>
	);
});
ResolvedProductNode.displayName = 'ResolvedProductNode';
