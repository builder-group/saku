import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedProductNode } from '../../types';
import { ClassicContent } from './ClassicContent';
import { Skeleton } from './Skeleton';

export const ResolvedProductNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedProductNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;
	const { content } = node;

	const renderContent = React.useCallback(() => {
		switch (content.type) {
			case 'classic': {
				if (node.content.product == null) {
					return <Skeleton node={node} />;
				}
				return <ClassicContent node={node} product={node.content.product} cx={cx} />;
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
ResolvedProductNode.displayName = 'ResolvedProductNode';
