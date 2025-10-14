import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedClassicBundle, ResolvedHeroBundle } from '../bundles';
import { TResolvedAboutNode } from '../types';

export const ResolvedAboutNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedAboutNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;

	const renderBundle = React.useCallback(() => {
		switch (node.bundleType) {
			case 'classic':
				return <ResolvedClassicBundle node={node} cx={cx} />;
			case 'hero':
				return <ResolvedHeroBundle node={node} cx={cx} />;
			default:
				return null;
		}
	}, [node, cx]);

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			{renderBundle()}
		</div>
	);
});
ResolvedAboutNode.displayName = 'ResolvedAboutNode';
