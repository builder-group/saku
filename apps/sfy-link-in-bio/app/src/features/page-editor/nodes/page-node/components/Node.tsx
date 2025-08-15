import { notEmpty } from '@blgc/utils';
import { TFlatPageNode } from '@repo/editor';
import { useCompute } from 'feature-react';
import React from 'react';
import { LogoIcon } from '@/components';
import { Node } from '../../../components';
import { EditorSiteResolveContext, TNodeProps } from '../../../lib';
import { resolvePageNodeWithoutChildren } from '../resolve-node';

export const PageNode = React.forwardRef<HTMLDivElement, TNodeProps<TFlatPageNode>>(
	(props, ref) => {
		const { nodeState, editor, ...divProps } = props;

		const { layout, childDefaults, fill, watermarkColor } = useCompute(
			nodeState,
			({ value: nodeValue }) => {
				return resolvePageNodeWithoutChildren(nodeValue, {
					site: new EditorSiteResolveContext(editor)
				});
			}
		);
		const childNodes = useCompute(
			nodeState,
			({ value: node }) => {
				return node.children.map((nodeId) => editor.nodeMap[nodeId]).filter(notEmpty);
			},
			[editor]
		);

		return (
			<div
				{...divProps}
				ref={ref}
				className="min-h-screen w-full"
				style={{ backgroundColor: fill?.paint.type === 'solid' ? fill?.paint.color : undefined }}
			>
				<div className="mx-auto w-full max-w-md">
					<div
						className="flex w-full flex-col p-6"
						style={{
							gap: layout.spacing,
							fontFamily: childDefaults?.typography?.font?.family,
							fontSize: childDefaults?.typography?.fontSize,
							color: childDefaults?.typography?.textColor
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
							className="mx-auto mt-12 flex items-center gap-2 pb-6 text-sm no-underline hover:opacity-75"
							style={{ color: watermarkColor }}
						>
							<LogoIcon className="h-6 w-6" />
							<span>Powered by Saku</span>
						</a>
					</div>
				</div>
			</div>
		);
	}
);
PageNode.displayName = 'PageNode';
