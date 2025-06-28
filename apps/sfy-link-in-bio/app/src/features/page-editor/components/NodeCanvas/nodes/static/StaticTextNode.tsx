import React from 'react';
import { TPageEditor } from '../../../../lib';
import { TTextNode } from '../../../../types';

export const StaticTextNode = React.forwardRef<HTMLDivElement, TStaticTextNodeProps>(
	(props, ref) => {
		const { node, editor, ...divProps } = props;

		// Style calculations with inheritance
		const style = React.useMemo(() => {
			const pageNode = editor.getRootNode()._v;

			function resolveStyle<T>(value: T | 'inherit' | undefined, fallback?: T): T | undefined {
				if (value === 'inherit') return fallback;
				return value ?? fallback;
			}

			return {
				padding: resolveStyle(node.style.padding, pageNode?.style.children?.padding),
				margin: resolveStyle(node.style.margin, pageNode?.style.children?.margin),
				backgroundColor: resolveStyle(
					node.style.backgroundColor,
					pageNode?.style.children?.backgroundColor
				),
				fontFamily: resolveStyle(node.style.fontFamily, pageNode?.style.children?.fontFamily),
				fontSize: resolveStyle(node.style.fontSize, pageNode?.style.children?.fontSize),
				textColor: resolveStyle(node.style.textColor, pageNode?.style.children?.textColor),
				textAlign: resolveStyle(node.style.textAlign, pageNode?.style.children?.textAlign),
				borderRadius: resolveStyle(node.style.borderRadius, pageNode?.style.children?.borderRadius),
				shadow: resolveStyle(node.style.shadow, pageNode?.style.children?.shadow)
			};
		}, [node.style, editor]);

		// Content component
		const content = (
			<div className="flex min-h-[96px] w-full flex-col justify-start p-4">
				{node.title && (
					<h3
						className="m-0 mb-2 font-medium break-words"
						style={{
							fontFamily: style.fontFamily,
							fontSize: style.fontSize ? style.fontSize * 1.25 : undefined, // Scale up for title
							color: style.textColor,
							textAlign: style.textAlign
						}}
					>
						{node.title}
					</h3>
				)}
				<p
					className="m-0 leading-relaxed break-words"
					style={{
						fontFamily: style.fontFamily,
						fontSize: style.fontSize,
						color: style.textColor,
						textAlign: style.textAlign
					}}
				>
					{node.text || 'Empty text...'}
				</p>
			</div>
		);

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				{style.backgroundColor ? (
					// Card style with background
					<div
						className="relative overflow-hidden"
						style={{
							padding: style.padding,
							margin: style.margin,
							backgroundColor: style.backgroundColor,
							borderRadius: style.borderRadius,
							boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
						}}
					>
						{content}
					</div>
				) : (
					// Flat style without background
					<div
						style={{
							padding: style.padding,
							margin: style.margin
						}}
					>
						{content}
					</div>
				)}
			</div>
		);
	}
);
StaticTextNode.displayName = 'StaticTextNode';

interface TStaticTextNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TTextNode;
	editor: TPageEditor;
}
