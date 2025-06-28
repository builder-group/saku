import React from 'react';
import { TPageNode } from '../../../../types';
import { StaticNode } from '../../StaticNode';

export const StaticPageNode: React.FC<TStaticPageNodeProps> = (props) => {
	const { node } = props;

	return (
		<div className="w-full max-w-md">
			{/* Page container with padding and layout */}
			<div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
				{/* Content area with padding */}
				<div className="flex w-full flex-col gap-3 p-6">
					{node.children.length === 0 ? (
						<div className="flex min-h-[96px] items-center justify-center text-neutral-400">
							Empty page...
						</div>
					) : (
						node.children.map((childNode) => <StaticNode key={childNode.id} node={childNode} />)
					)}
				</div>

				{/* Border and highlight effects */}
				<div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/[0.08]" />
				<div className="pointer-events-none absolute inset-[1px] rounded-[23px] ring-1 ring-white/[0.22]" />
			</div>
		</div>
	);
};

interface TStaticPageNodeProps {
	node: TPageNode;
}
