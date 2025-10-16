import React from 'react';
import { TResolvedMediaNode } from '../types';

export const Skeleton = React.forwardRef<HTMLDivElement, TSkeletonProps>((props, ref) => {
	const {
		node: { autoLayout, appearance, fill, stroke, shadow, image }
	} = props;

	return (
		<div
			ref={ref}
			className="relative flex w-full items-center gap-3 bg-white"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			<div
				className="flex aspect-[16/9] w-full animate-pulse bg-neutral-300"
				style={{ borderRadius: image.appearance.styles.borderRadius }}
			></div>
		</div>
	);
});
Skeleton.displayName = 'Skeleton';

interface TSkeletonProps {
	node: TResolvedMediaNode;
}
