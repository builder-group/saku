import React from 'react';
import { ResolvedNode } from '../../../components';
import { TResolvedNodeProps } from '../../../lib';
import { TResolvedPageNode } from '../types';
import { PageWrapper } from './PageWrapper';

export const ResolvedPageNode: React.FC<TResolvedNodeProps<TResolvedPageNode>> = (props) => {
	const { node, cx, ...divProps } = props;

	return (
		<PageWrapper node={node} {...divProps}>
			{node.children.map((childNode) => (
				<ResolvedNode key={childNode.id} node={childNode} cx={cx} />
			))}
		</PageWrapper>
	);
};
