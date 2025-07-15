import { TTextNode } from '@repo/editor';
import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { resolveTextNode } from '../../../lib';
import { TResolvedTextNode } from '../../../types';
import { StaticTextNode } from './static';
import { TNodeProps } from './types';

export const TextNode = React.forwardRef<HTMLDivElement, TNodeProps<TTextNode>>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TResolvedTextNode => {
			return resolveTextNode(nodeValue, {
				assetsMap: editor.assetsMap,
				defaultStyles: pageNodeValue?.style.children,
				shopId: editor.shopId
			});
		}
	);

	return <StaticTextNode {...divProps} ref={ref} node={node} />;
});
TextNode.displayName = 'TextNode';
