import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../lib';
import { TLinkNode, TWithResolvedStyles } from '../../../types';
import { StaticLinkNode } from './static';

export const LinkNode = React.forwardRef<HTMLDivElement, TLinkNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TWithResolvedStyles<TLinkNode> => {
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
					fontFamily: resolveStyle(
						nodeValue.style.fontFamily,
						pageNodeValue?.style.children?.fontFamily
					),
					fontSize: resolveStyle(nodeValue.style.fontSize, pageNodeValue?.style.children?.fontSize),
					textColor: resolveStyle(
						nodeValue.style.textColor,
						pageNodeValue?.style.children?.textColor
					),
					textAlign: resolveStyle(
						nodeValue.style.textAlign,
						pageNodeValue?.style.children?.textAlign
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

	return <StaticLinkNode {...divProps} ref={ref} node={node} />;
});
LinkNode.displayName = 'LinkNode';

interface TLinkNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TLinkNode>;
	editor: TPageEditor;
}
