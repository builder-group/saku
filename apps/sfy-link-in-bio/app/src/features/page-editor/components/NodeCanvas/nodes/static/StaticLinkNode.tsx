import React from 'react';
import { TPageEditor } from '../../../../lib';
import { TLinkNode } from '../../../../types';

export const StaticLinkNode = React.forwardRef<HTMLDivElement, TStaticLinkNodeProps>(
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

		const title = node.meta?.title;
		const description = node.meta?.description;
		const faviconUrl = node.meta?.faviconUrl;

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				<div
					className="relative overflow-hidden bg-white"
					style={{
						padding: style.padding,
						margin: style.margin,
						backgroundColor: style.backgroundColor,
						fontFamily: style.fontFamily,
						fontSize: style.fontSize,
						color: style.textColor,
						textAlign: style.textAlign,
						borderRadius: style.borderRadius,
						boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
					}}
				>
					<div className="flex w-full items-center gap-3 p-4">
						{/* Site Icon */}
						{faviconUrl && (
							<div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded bg-gray-100">
								<img
									src={faviconUrl}
									alt={title ?? 'Site Icon'}
									className="h-full w-full object-cover"
									draggable={false}
								/>
							</div>
						)}

						{/* Link Details */}
						<div className="min-w-0 flex-grow">
							{title && <p className="truncate font-medium">{title}</p>}
							{description && <p className="truncate text-sm opacity-70">{description}</p>}
						</div>
					</div>
				</div>
			</div>
		);
	}
);
StaticLinkNode.displayName = 'StaticLinkNode';

interface TStaticLinkNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TLinkNode;
	editor: TPageEditor;
}
