import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../lib';
import { TMediaNode, TWithResolvedStyles } from '../../../types';
import { StaticMediaNode } from './static';

export const MediaNode = React.forwardRef<HTMLDivElement, TMediaNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TWithResolvedStyles<TMediaNode> => {
			function resolveStyle<T>(value: T | 'inherit' | undefined, fallback?: T): T | undefined {
				if (value === 'inherit') return fallback;
				return value ?? fallback;
			}

			return {
				...nodeValue,
				style: {
					padding: resolveStyle(nodeValue.style.padding, pageNodeValue?.style.children?.padding),
					margin: resolveStyle(nodeValue.style.margin, pageNodeValue?.style.children?.margin),
					backgroundColor: resolveStyle(
						nodeValue.style.backgroundColor,
						pageNodeValue?.style.children?.backgroundColor
					),
					borderRadius: resolveStyle(
						nodeValue.style.borderRadius,
						pageNodeValue?.style.children?.borderRadius
					),
					shadow: resolveStyle(nodeValue.style.shadow, pageNodeValue?.style.children?.shadow)
				}
			};
		}
	);

	return <StaticMediaNode {...divProps} ref={ref} node={node} />;
});
MediaNode.displayName = 'MediaNode';

interface TMediaNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TMediaNode>;
	editor: TPageEditor;
}
