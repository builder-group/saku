import React from 'react';
import { TResolvedProductNode } from '../../../../types';

export const StaticProductNode = React.forwardRef<HTMLDivElement, TStaticProductNodeProps>(
	(props, ref) => {
		const {
			node: { content, style },
			...divProps
		} = props;

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				<div
					className="relative overflow-hidden"
					style={{
						padding: style.padding,
						backgroundColor: style.backgroundColor,
						borderRadius: style.borderRadius,
						boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
					}}
				>
					<div className="flex min-h-12 w-full flex-col justify-start p-4">
						{JSON.stringify(content)}
					</div>
				</div>
			</div>
		);
	}
);
StaticProductNode.displayName = 'StaticProductNode';

interface TStaticProductNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TResolvedProductNode;
}
