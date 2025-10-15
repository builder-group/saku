import React from 'react';
import { TResolvedNodeProps } from '../../../lib';
import { ResolvedRichBundle } from '../bundles';
import { TResolvedTextNode } from '../types';

export const ResolvedTextNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedTextNode>
>((props, ref) => {
	const { node, cx, ...divProps } = props;

	const renderBundle = React.useCallback(() => {
		switch (node.bundleType) {
			case 'rich':
				return <ResolvedRichBundle node={node} cx={cx} />;
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
ResolvedTextNode.displayName = 'ResolvedTextNode';
