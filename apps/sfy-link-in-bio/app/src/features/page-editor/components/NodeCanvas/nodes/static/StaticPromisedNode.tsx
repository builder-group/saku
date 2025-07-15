import { Await } from '@remix-run/react';
import React from 'react';
import { TResolvedNode, TResolvedPromisedNode } from '../../../../types';
import { StaticNode } from '../../StaticNode';
import { TStaticNodeProps } from '../types';

export const StaticPromisedNode = React.forwardRef<
	HTMLDivElement,
	TStaticNodeProps<TResolvedPromisedNode<TResolvedNode>>
>((props, ref) => {
	const { node } = props;

	// TODO: pass indicator to StaticNode whether its loading or error
	return (
		<React.Suspense fallback={<StaticNode ref={ref} node={node.cached} state="loading" />}>
			<Await
				resolve={node.next}
				errorElement={<StaticNode ref={ref} node={node.cached} state="error" />}
			>
				{(resolvedNode) => {
					return <StaticNode ref={ref} node={resolvedNode} state="success" />;
				}}
			</Await>
		</React.Suspense>
	);
});
StaticPromisedNode.displayName = 'StaticPromisedNode';
