import React from 'react';
import { isNodeVisible, resolvedNodeRegistry, TResolvedNodeProps } from '../lib';
import { TResolvedNode } from '../types';

export const ResolvedNode = React.forwardRef<HTMLDivElement, TResolvedNodeProps<TResolvedNode>>(
	(props, ref) => {
		const { node, state, cx } = props;

		const isVisible = React.useMemo(() => {
			return isNodeVisible(node);
		}, [node]);

		const ResolvedNodeComponent = React.useMemo(
			() =>
				resolvedNodeRegistry[node.type] as React.ComponentType<TResolvedNodeProps<TResolvedNode>>,
			[node.type]
		);

		if (!isVisible) {
			return null;
		}

		return <ResolvedNodeComponent ref={ref} node={node} state={state} cx={cx} />;
	}
);
ResolvedNode.displayName = 'ResolvedNode';
