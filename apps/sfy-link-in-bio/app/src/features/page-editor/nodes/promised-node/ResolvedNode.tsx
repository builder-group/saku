import React from 'react';
import { Await } from 'react-router';
import { ResolvedNode } from '../../components';
import { TResolvedNodeProps } from '../../lib';
import { TResolvedNode } from '../../types';
import { TResolvedPromisedNode } from './types';

export const ResolvedPromisedNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedPromisedNode<TResolvedNode>>
>((props, ref) => {
	const { node, cx } = props;

	return (
		<React.Suspense
			fallback={<ResolvedNode ref={ref} node={node.cached} cx={cx} state="loading" />}
		>
			<Await
				resolve={node.next}
				errorElement={<ResolvedNode ref={ref} node={node.cached} cx={cx} state="error" />}
			>
				{(resolvedNode) => {
					return <ResolvedNode ref={ref} node={resolvedNode} cx={cx} state="success" />;
				}}
			</Await>
		</React.Suspense>
	);
});
ResolvedPromisedNode.displayName = 'ResolvedPromisedNode';
