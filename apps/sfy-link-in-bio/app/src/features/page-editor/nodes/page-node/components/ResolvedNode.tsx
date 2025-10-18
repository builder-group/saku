import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedClassicBundle } from '../bundles';
import { TResolvedPageNode } from '../types';

export const ResolvedPageNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedPageNode>
>((props, ref) => {
	const { node, ...rest } = props;

	switch (node.bundleType) {
		case 'classic':
			return <ResolvedClassicBundle ref={ref} node={node} {...rest} />;
		default:
			return null;
	}
});
ResolvedPageNode.displayName = 'ResolvedPageNode';
