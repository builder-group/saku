import React from 'react';
import { TResolvedProductNode } from '../types';

export const Skeleton = React.forwardRef<HTMLDivElement, TSkeletonProps>((props, ref) => {
	const {
		node: { autoLayout, appearance, fill, stroke, shadow }
	} = props;

	return (
		<div
			ref={ref}
			className="flex flex-row items-center gap-3 bg-white"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			<div
				className="h-12 w-12 animate-pulse bg-neutral-300"
				style={{ borderRadius: appearance.styles.borderRadius }}
			/>
			<div className="flex flex-col gap-1">
				<div className="h-4 w-32 animate-pulse bg-neutral-300"></div>
				<div className="h-3 w-16 animate-pulse bg-neutral-300"></div>
			</div>
		</div>
	);
});
Skeleton.displayName = 'Skeleton';

interface TSkeletonProps {
	node: TResolvedProductNode;
}
