import React from 'react';
import { LogoIcon } from '@/components';
import { ResolvedNode } from '../../../components';
import { TResolvedNodeProps } from '../../../lib';
import { TResolvedPageNode } from '../types';

export const ResolvedPageNode: React.FC<TResolvedNodeProps<TResolvedPageNode>> = (props) => {
	const {
		node: { hasWatermark, children, autoLayout, appearance, fill },
		cx,
		...divProps
	} = props;

	return (
		<>
			<div
				{...divProps}
				className="relative min-h-screen w-full overflow-x-hidden"
				style={{
					...appearance.styles,
					...fill?.styles
				}}
			>
				<div className="mx-auto w-full max-w-md">
					<div className="flex w-full flex-col" style={autoLayout.styles}>
						{children.map((childNode) => (
							<ResolvedNode key={childNode.id} node={childNode} cx={cx} />
						))}
					</div>
				</div>
			</div>

			{/* Watermark */}
			{hasWatermark && (
				<div className="sticky bottom-0 w-full">
					<a
						href="https://saku.so"
						target="_blank"
						rel="noopener noreferrer"
						className="absolute right-4 bottom-4 z-[999] flex items-center gap-1 rounded-lg bg-white px-2 py-[6px] text-sm text-black no-underline shadow-[0_0_0_1px_rgba(20,24,31,0.025),0_2px_8px_rgba(20,24,31,0.1)] hover:opacity-75"
					>
						<LogoIcon className="h-6 w-6" />
						<span>Made in Saku</span>
					</a>
				</div>
			)}
		</>
	);
};
