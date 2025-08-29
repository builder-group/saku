import { TResolvedMediaNode } from '../../types';

export const Skeleton: React.FC<TSkeletonProps> = (props) => {
	const {
		node: { autoLayout, appearance, fill, stroke, shadow }
	} = props;

	return (
		<div
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
				className="flex aspect-[16/9] w-full animate-pulse bg-gray-300"
				style={{ borderRadius: appearance?.borderRadius }}
			></div>
		</div>
	);
};

interface TSkeletonProps {
	node: TResolvedMediaNode;
}
