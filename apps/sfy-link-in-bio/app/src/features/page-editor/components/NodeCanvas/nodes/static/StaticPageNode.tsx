import React from 'react';
import { LogoIcon } from '@/components';
import { TResolvedPageNode } from '../../../../types';
import { StaticNode } from '../../StaticNode';

export const StaticPageNode: React.FC<TStaticPageNodeProps> = (props) => {
	const { node } = props;

	return (
		<div className="min-h-screen w-full" style={{ backgroundColor: node.style.backgroundColor }}>
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
					{node.children.length === 0 ? (
						<div className="flex min-h-[96px] items-center justify-center text-neutral-400">
							Empty page...
						</div>
					) : (
						node.children.map((childNode) => <StaticNode key={childNode.id} node={childNode} />)
					)}

					{/* Watermark */}
					<a
						href="https://saku.so"
						target="_blank"
						rel="noopener noreferrer"
						className="mx-auto mt-12 flex items-center gap-2 pb-6 text-sm no-underline invert-100 hover:opacity-75"
						style={{
							color: node.style.backgroundColor
						}}
					>
						<LogoIcon className="h-6 w-6" />
						<span>Powered by Saku</span>
					</a>
				</div>
			</div>
		</div>
	);
};

interface TStaticPageNodeProps {
	node: TResolvedPageNode;
}
