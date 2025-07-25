import React from 'react';
import { TResolvedProductNode } from '../../../../../types';
import { TStaticNodeProps } from '../../types';
import { StaticProductNodeContent } from './StaticProductNodeContent';
import { StaticProductNodeSkeleton } from './StaticProductNodeSkeleton';

export const StaticProductNode = React.forwardRef<
	HTMLDivElement,
	TStaticNodeProps<TResolvedProductNode>
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
				<StaticProductNodeContent product={product} style={style} cx={cx} />
			) : (
				<StaticProductNodeSkeleton style={style} />
			)}
		</div>
	);
});
StaticProductNode.displayName = 'StaticProductNode';
