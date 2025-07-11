import { notEmpty } from '@blgc/utils';
import { TPageNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { LogoIcon } from '@/components';
import { resolvePageNodeWithoutChildren, TNodeState, TPageEditor } from '../../../lib';
import { Node } from '../Node';

export const PageNode = React.forwardRef<HTMLDivElement, TPageNodeProps>((props, ref) => {
	const { nodeState, editor, ...divProps } = props;

	const node = useCompute(nodeState, (nodeValue) => {
		return resolvePageNodeWithoutChildren(nodeValue);
	});
	const childNodes = useCompute(
		nodeState,
		(node) => {
			return node.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty);
		},
		[editor]
	);

	return (
		<div
			{...divProps}
			ref={ref}
			className="min-h-screen w-full"
			style={{ backgroundColor: node.style.backgroundColor }}
		>
			<div className="mx-auto w-full max-w-md">
				<div
					className="flex w-full flex-col p-6"
					style={{
						gap: node.style.children?.spacing,
						fontFamily: node.style.children?.font?.family,
						fontSize: node.style.children?.fontSize,
						color: node.style.children?.textColor
					}}
				>
					{childNodes.map((childNodeState) => (
						<Node key={childNodeState._v.id} nodeState={childNodeState} editor={editor} />
					))}

					{/* Watermark */}
					<a
						href="https://saku.so"
						target="_blank"
						rel="noopener noreferrer"
						className="mx-auto mt-12 flex items-center gap-2 pb-6 text-sm text-white no-underline mix-blend-difference hover:opacity-75"
					>
						<LogoIcon className="h-6 w-6" />
						<span>Powered by Saku</span>
					</a>
				</div>
			</div>
		</div>
	);
});
PageNode.displayName = 'PageNode';

interface TPageNodeProps extends React.HTMLProps<HTMLDivElement> {
	nodeState: TNodeState<TPageNode>;
	editor: TPageEditor;
}
