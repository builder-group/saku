import React from 'react';
import { LogoIcon } from '@/components';
import { ResolvedNode } from '../../../components';
import { TResolvedNodeProps } from '../../../lib';
import { TResolvedPageNode } from '../types';

export const ResolvedPageNode: React.FC<TResolvedNodeProps<TResolvedPageNode>> = (props) => {
	const {
		node: { children, layout, appearance, fill, watermarkColor },
		cx,
		...divProps
	} = props;

	return (
		<div
			{...divProps}
			className="min-h-screen w-full"
			style={{
				...appearance.styles,
				...fill?.styles
			}}
		>
			<div className="mx-auto w-full max-w-md">
				<div
					className="flex w-full flex-col p-6"
					style={{
						gap: layout.styles.gap
					}}
				>
					{children.map((childNode) => (
						<ResolvedNode key={childNode.id} node={childNode} cx={cx} />
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
};
