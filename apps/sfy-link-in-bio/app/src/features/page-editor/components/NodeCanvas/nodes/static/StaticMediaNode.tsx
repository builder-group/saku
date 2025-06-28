import React from 'react';
import { TPageEditor } from '../../../../lib';
import { TMediaNode } from '../../../../types';

export const StaticMediaNode = React.forwardRef<HTMLDivElement, TStaticMediaNodeProps>(
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
				borderRadius: resolveStyle(node.style.borderRadius, pageNode?.style.children?.borderRadius),
				shadow: resolveStyle(node.style.shadow, pageNode?.style.children?.shadow)
			};
		}, [node.style, editor]);

		// Only handle image type for now
		if (node.media.type !== 'image') {
			return null;
		}

		// Content component
		const content = (
			<>
				{node.media.url ? (
					<img
						src={node.media.url}
						alt={node.media.altText ?? ''}
						className="h-auto w-full object-cover"
						draggable={false}
						style={{ borderRadius: style.borderRadius }}
					/>
				) : (
					<div
						className="flex aspect-[16/9] w-full items-center justify-center bg-gray-100 text-gray-400"
						style={{ borderRadius: style.borderRadius }}
					>
						No Image
					</div>
				)}
			</>
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
					// Flat style without background container
					<div
						style={{
							padding: style.padding,
							margin: style.margin,
							borderRadius: style.borderRadius,
							boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
						}}
					>
						{content}
					</div>
				)}
			</div>
		);
	}
);
StaticMediaNode.displayName = 'StaticMediaNode';

interface TStaticMediaNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TMediaNode;
	editor: TPageEditor;
}
