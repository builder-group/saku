import { useCombinedCompute } from 'feature-react';
import React from 'react';
import { TNodeState, TPageEditor } from '../../../lib';
import type { TAboutNode, TWithResolvedStyles } from '../../../types';
import { StaticAboutNode } from './static';

export const AboutNode = React.forwardRef<HTMLDivElement, TAboutNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCombinedCompute(
		[editor.getRootNode(), nodeState],
		([pageNodeValue, nodeValue]): TWithResolvedStyles<TAboutNode> => {
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

	return <StaticAboutNode {...divProps} ref={ref} node={node} />;
});
AboutNode.displayName = 'AboutNode';

interface TAboutNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TAboutNode>;
	editor: TPageEditor;
}
