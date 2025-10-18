import React from 'react';
import { ResolvedNode } from '../../../../components';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedClassicPageNodeBundle } from '../../types';
import { BundleLayout } from './BundleLayout';

export const ResolvedClassicBundle = React.forwardRef<HTMLDivElement, TResolvedClassicBundleProps>(
	(props, ref) => {
		const { node, cx, ...divProps } = props;

		return (
			<BundleLayout ref={ref} node={node} {...divProps}>
				{node.children.map((childNode) => (
					<ResolvedNode key={childNode.id} node={childNode} cx={cx} />
				))}
			</BundleLayout>
		);
	}
);
ResolvedClassicBundle.displayName = 'ResolvedClassicBundle';

interface TResolvedClassicBundleProps {
	node: TResolvedClassicPageNodeBundle;
	cx: TResolvedNodeProps<TResolvedClassicPageNodeBundle>['cx'];
}
