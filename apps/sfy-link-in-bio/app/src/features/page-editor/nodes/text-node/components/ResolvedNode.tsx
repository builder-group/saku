import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedRichBundle, ResolvedSectionTitleBundle } from '../bundles';
import { TResolvedTextNode } from '../types';

export const ResolvedTextNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedTextNode>
>((props, ref) => {
	const { node, ...rest } = props;

	switch (node.bundleType) {
		case 'rich':
			return <ResolvedRichBundle ref={ref} node={node} {...rest} />;
		case 'section-title':
			return <ResolvedSectionTitleBundle ref={ref} node={node} {...rest} />;
		default:
			return null;
	}
});
ResolvedTextNode.displayName = 'ResolvedTextNode';
