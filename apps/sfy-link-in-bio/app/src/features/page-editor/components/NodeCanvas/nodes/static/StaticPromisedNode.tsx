import { Await } from '@remix-run/react';
import React from 'react';
import { TResolvedNode, TResolvedPromisedNode } from '../../../../types';
import { StaticNode } from '../../StaticNode';

export const StaticPromisedNode = React.forwardRef<HTMLDivElement, TStaticPromisedNodeProps>(
	(props, ref) => {
		const { node } = props;

		// TODO: pass indicator to StaticNode whether its loading or error
		return (
			<React.Suspense fallback={<StaticNode ref={ref} node={node.cached} />}>
				<Await resolve={node.next} errorElement={<StaticNode ref={ref} node={node.cached} />}>
					{(resolvedNode) => {
						return <StaticNode ref={ref} node={resolvedNode} />;
					}}
				</Await>
			</React.Suspense>
		);
	}
);
StaticPromisedNode.displayName = 'StaticPromisedNode';

interface TStaticPromisedNodeProps {
	node: TResolvedPromisedNode<TResolvedNode>;
}
