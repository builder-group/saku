import { TClassicFlatPageNodeBundle, TFlatPageNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { TNodeProps, TNodeState } from '../../../lib';
import { ClassicBundle } from '../bundles';

export const PageNode = React.forwardRef<HTMLDivElement, TNodeProps<TFlatPageNode>>(
	(props, ref) => {
		const { nodeState, ...rest } = props;
		const bundleType = useCompute(nodeState, ({ value }) => value.bundleType);

		switch (bundleType) {
			case 'classic':
				return (
					<ClassicBundle
						ref={ref}
						nodeState={nodeState as TNodeState<TClassicFlatPageNodeBundle>}
						{...rest}
					/>
				);
			default:
				return null;
		}
	}
);
PageNode.displayName = 'PageNode';
