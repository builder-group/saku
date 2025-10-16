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

	const { contentRadius, glassBorderRadius, borderWidth, borderColor } = React.useMemo(() => {
		const contentRadius = 8; // px
		const borderWidth = 5; // px
		const borderColor = '#ffffff52';
		return {
			contentRadius,
			glassBorderRadius: contentRadius + borderWidth,
			borderWidth,
			borderColor
		};
	}, []);

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
				<div className="absolute inset-0 hidden bg-black/10 backdrop-blur-xl sm:block" />

				<div className="relative mx-auto w-full max-w-xl sm:pt-10">
					<div className="relative">
						<div
							className="overflow-hidden sm:pb-10 sm:shadow-[0_24px_32px_0px_rgba(0,0,0,0.15)]"
							style={{
								...appearance.styles,
								...fill?.styles,
								borderTopLeftRadius: contentRadius,
								borderTopRightRadius: contentRadius
							}}
						>
							<div className="flex w-full flex-col" style={autoLayout.styles}>
								{children.map((childNode) => (
									<ResolvedNode key={childNode.id} node={childNode} cx={cx} />
								))}
							</div>
						</div>

						<div
							className="pointer-events-none absolute top-0 left-0 hidden h-full w-full sm:block"
							style={{
								marginTop: -borderWidth,
								marginLeft: -borderWidth,
								width: `calc(100% + ${borderWidth * 2}px)`,
								borderTopWidth: borderWidth,
								borderRightWidth: borderWidth,
								borderLeftWidth: borderWidth,
								borderColor,
								borderStyle: 'solid',
								borderTopLeftRadius: glassBorderRadius,
								borderTopRightRadius: glassBorderRadius
							}}
						/>
					</div>
				</div>
			</div>

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
