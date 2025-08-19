import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedProductNode } from '../../types';
import { Content } from './Content';
import { Skeleton } from './Skeleton';

export const ResolvedProductNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedProductNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;
	const { content } = node;

	return (
		<div ref={ref} {...divProps} className="w-full max-w-md">
			{content.product != null ? (
				<Content product={content.product} node={node} cx={cx} />
			) : (
				<Skeleton node={node} />
			)}
		</div>
	);
});
ResolvedProductNode.displayName = 'ResolvedProductNode';
