import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedProductNode } from '../../../../types';
import { Content } from './Content';
import { Skeleton } from './Skeleton';

export const ResolvedProductNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedProductNode>
>((props, ref) => {
	const {
		node: {
			content: { product },
			style
		},
		cx,
		...divProps
	} = props;

	return (
		<div ref={ref} {...divProps} className="w-full max-w-md">
			{product != null ? (
				<Content product={product} style={style} cx={cx} />
			) : (
				<Skeleton style={style} />
			)}
		</div>
	);
});
ResolvedProductNode.displayName = 'ResolvedProductNode';
