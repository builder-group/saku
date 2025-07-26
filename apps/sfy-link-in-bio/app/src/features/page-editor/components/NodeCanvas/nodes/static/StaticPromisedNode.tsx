import { Await } from 'react-router';
import React from 'react';
import { TResolvedNode, TResolvedPromisedNode } from '../../../../types';
import { StaticNode } from '../../StaticNode';
import { TStaticNodeProps } from '../types';

export const StaticPromisedNode = React.forwardRef<
	HTMLDivElement,
	TStaticNodeProps<TResolvedPromisedNode<TResolvedNode>>
>((props, ref) => {
	const { node, cx } = props;

	return (
		<React.Suspense fallback={<StaticNode ref={ref} node={node.cached} cx={cx} state="loading" />}>
			<Await
				resolve={node.next}
				errorElement={<StaticNode ref={ref} node={node.cached} cx={cx} state="error" />}
			>
				{(resolvedNode) => {
					return <StaticNode ref={ref} node={resolvedNode} cx={cx} state="success" />;
				}}
			</Await>
		</React.Suspense>
	);
});
StaticPromisedNode.displayName = 'StaticPromisedNode';
