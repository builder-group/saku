import { TResolvedProductNode } from '../../../../../../types';

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
				className="h-12 w-12 flex-shrink-0 animate-pulse bg-gray-300"
				style={{ borderRadius: style.borderRadius }}
			></div>
			<div className="flex min-w-0 flex-grow flex-col gap-1">
				<div className="h-4 w-32 animate-pulse bg-gray-300"></div>
				<div className="h-3 w-16 animate-pulse bg-gray-300"></div>
			</div>
		</div>
	);
};

interface TSkeletonProps {
	style: TResolvedProductNode['style'];
}
