import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedRichBundle } from '../bundles';
import { TResolvedTextNode } from '../types';

export const ResolvedTextNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedTextNode>
>((props, ref) => {
	const { node, cx } = props;

	switch (node.bundleType) {
		case 'rich':
			return <ResolvedRichBundle ref={ref} node={node} cx={cx} />;
		default:
			return null;
	}
});
ResolvedTextNode.displayName = 'ResolvedTextNode';
