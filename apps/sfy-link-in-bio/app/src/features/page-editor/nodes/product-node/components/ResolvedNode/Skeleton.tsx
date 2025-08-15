import React from 'react';
import { TResolvedProductNode } from '../../types';

export const Skeleton: React.FC<TSkeletonProps> = (props) => {
	const {
		node: { layout, appearance, fill, stroke, shadow }
	} = props;

	return (
		<div
			className="relative flex w-full items-center gap-3 bg-white"
			style={{
				padding: layout?.padding,
				backgroundColor: fill?.paint.type === 'solid' ? fill?.paint.color : undefined,
				borderRadius: appearance?.borderRadius,
				boxShadow: shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			<div
				className="h-12 w-12 flex-shrink-0 animate-pulse bg-gray-300"
				style={{ borderRadius: appearance?.borderRadius }}
			></div>
			<div className="flex min-w-0 flex-grow flex-col gap-1">
				<div className="h-4 w-32 animate-pulse bg-gray-300"></div>
				<div className="h-3 w-16 animate-pulse bg-gray-300"></div>
			</div>
		</div>
	);
};

interface TSkeletonProps {
	node: TResolvedProductNode;
}
