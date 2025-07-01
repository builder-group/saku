import React from 'react';
import { TResolvedTextNode } from '../../../../types';

export const StaticTextNode = React.forwardRef<HTMLDivElement, TStaticTextNodeProps>(
	(props, ref) => {
		const { node, ...divProps } = props;

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				<div
					className="relative overflow-hidden"
					style={{
						padding: node.style.padding,
						margin: node.style.margin,
						backgroundColor: node.style.backgroundColor,
						borderRadius: node.style.borderRadius,
						boxShadow: node.style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
					}}
				>
					<div className="flex min-h-12 w-full flex-col justify-start p-4">
						{node.title != null && (
							<h3
								className="m-0 mb-2 font-medium break-words"
								style={{
									fontFamily: node.style.font?.family,
									fontSize:
										typeof node.style.fontSize === 'number'
											? node.style.fontSize * 1.25
											: undefined, // Scale up for title
									color: node.style.textColor,
									textAlign: node.style.textAlign
								}}
							>
								{node.title}
							</h3>
						)}
						<p
							className="m-0 leading-relaxed break-words"
							style={{
								fontFamily: node.style.font?.family,
								fontSize: node.style.fontSize,
								color: node.style.textColor,
								textAlign: node.style.textAlign
							}}
						>
							{node.text || 'Empty text...'}
						</p>
					</div>
				</div>
			</div>
		);
	}
);
StaticTextNode.displayName = 'StaticTextNode';

interface TStaticTextNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TResolvedTextNode;
}
