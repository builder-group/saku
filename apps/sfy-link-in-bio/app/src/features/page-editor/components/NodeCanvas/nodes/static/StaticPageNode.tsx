import React from 'react';
import { LogoIcon } from '@/components';
import { TResolvedPageNode } from '../../../../types';
import { StaticNode } from '../../StaticNode';

export const StaticPageNode: React.FC<TStaticPageNodeProps> = (props) => {
	const { node, ...divProps } = props;

	return (
		<div
			{...divProps}
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
					{node.children.map((childNode) => (
						<StaticNode key={childNode.id} node={childNode} />
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
};

interface TStaticPageNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TResolvedPageNode;
}
