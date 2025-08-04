import { TResolvedMediaNode } from '../../../../../../types';

export const Skeleton: React.FC<TSkeletonProps> = (props) => {
	const { style } = props;

	return (
		<div
			className="relative flex w-full items-center gap-3 bg-white"
			style={{
				padding: style.padding,
				backgroundColor: style.backgroundColor,
				borderRadius: style.borderRadius,
				boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
			}}
		>
			<div
				className="flex aspect-[16/9] w-full animate-pulse bg-gray-300"
				style={{ borderRadius: style.borderRadius }}
			></div>
		</div>
	);
};

interface TSkeletonProps {
	style: TResolvedMediaNode['style'];
}
