import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedClassicBundle, ResolvedHeroBundle } from '../bundles';
import { TResolvedAboutNode } from '../types';

export const ResolvedAboutNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedAboutNode>
>((props, ref) => {
	const { node, ...rest } = props;

	switch (node.bundleType) {
		case 'classic':
			return <ResolvedClassicBundle ref={ref} node={node} {...rest} />;
		case 'hero':
			return <ResolvedHeroBundle ref={ref} node={node} {...rest} />;
		default:
			return null;
	}
});
ResolvedAboutNode.displayName = 'ResolvedAboutNode';
