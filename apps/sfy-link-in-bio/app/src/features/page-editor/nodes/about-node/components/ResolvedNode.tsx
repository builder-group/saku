import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedClassicBundle, ResolvedHeroBundle } from '../bundles';
import { TResolvedAboutNode } from '../types';

export const ResolvedAboutNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedAboutNode>
>((props, ref) => {
	const { node, cx } = props;

	switch (node.bundleType) {
		case 'classic':
			return <ResolvedClassicBundle ref={ref} node={node} cx={cx} />;
		case 'hero':
			return <ResolvedHeroBundle ref={ref} node={node} cx={cx} />;
		default:
			return null;
	}
});
ResolvedAboutNode.displayName = 'ResolvedAboutNode';
