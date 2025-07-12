import React from 'react';
import { TResolvedTextNode } from '../../../../types';

export const StaticTextNode = React.forwardRef<HTMLDivElement, TStaticTextNodeProps>(
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
						{content.title != null && (
							<h3
								className="m-0 mb-2 font-medium break-words"
								style={{
									fontFamily: style.font?.family,
									fontSize: typeof style.fontSize === 'number' ? style.fontSize * 1.25 : undefined, // Scale up for title
									color: style.textColor,
									textAlign: style.textAlign
								}}
							>
								{content.title}
							</h3>
						)}
						<p
							className="m-0 leading-relaxed break-words"
							style={{
								fontFamily: style.font?.family,
								fontSize: style.fontSize,
								color: style.textColor,
								textAlign: style.textAlign
							}}
						>
							{content.text}
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
