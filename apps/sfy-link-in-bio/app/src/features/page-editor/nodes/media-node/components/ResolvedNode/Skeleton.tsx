import { TResolvedMediaNode } from '../../types';

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
				className="flex aspect-[16/9] w-full animate-pulse bg-gray-300"
				style={{ borderRadius: appearance?.borderRadius }}
			></div>
		</div>
	);
};

interface TSkeletonProps {
	node: TResolvedMediaNode;
}
