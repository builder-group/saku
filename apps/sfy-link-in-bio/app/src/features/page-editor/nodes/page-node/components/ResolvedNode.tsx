import React from 'react';
import { ResolvedNode } from '../../../components';
import { TResolvedNodeProps } from '../../../lib';
import { ClassicBundleLayout } from '../bundles';
import { TResolvedPageNode } from '../types';

export const ResolvedPageNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedPageNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;

	const BundleLayout = React.useMemo(() => {
		switch (node.bundleType) {
			case 'classic':
				return ClassicBundleLayout;
			default:
				return null;
		}
	}, [node.bundleType]);

	if (BundleLayout == null) {
		return null;
	}

	return (
		<BundleLayout ref={ref} node={node} {...divProps}>
			{node.children.map((childNode) => (
				<ResolvedNode key={childNode.id} node={childNode} cx={cx} />
			))}
		</BundleLayout>
	);
});
ResolvedPageNode.displayName = 'ResolvedPageNode';
