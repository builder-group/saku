import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedLinkNode, TResolvedSingleLinkNodeContent } from '../../types';

export const DefaultContent: React.FC<TSingleContentProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, text, smText, image }
	} = props;

	const imageBorderRadius = React.useMemo(() => {
		const verticalPadding = autoLayout?.verticalPadding ?? 0;
		const horizontalPadding = autoLayout?.horizontalPadding ?? 0;
		const padding = Math.max(verticalPadding, horizontalPadding);

		const outerRadius = appearance?.borderRadius;
		if (outerRadius == null || outerRadius === 0) {
			return undefined;
		}

		const ratio = outerRadius / (outerRadius + padding);
		return outerRadius * Math.pow(ratio, 1.5);
	}, [autoLayout?.verticalPadding, autoLayout?.horizontalPadding, appearance?.borderRadius]);

	return (
		<a
			href={content.url}
			target="_blank"
			rel="noopener noreferrer"
			className="relative flex w-full cursor-pointer items-center gap-3 overflow-hidden bg-white text-inherit no-underline hover:opacity-90"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			<div className="flex min-h-12 w-full items-center gap-3">
				{/* Site Icon */}
				{content.favicon != null && (
					<div
						className="h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-100"
						style={{ ...image.styles, borderRadius: imageBorderRadius }}
					>
						<img
							src={content.favicon.src}
							alt={content.title ?? 'Site Icon'}
							className="h-full w-full object-cover"
							draggable={false}
						/>
					</div>
				)}

				{/* Link Details */}
				<div className="min-w-0 flex-grow">
					{content.title != null && (
						<p className="truncate font-medium" style={text.styles}>
							{content.title}
						</p>
					)}
					{content.description != null && (
						<p className="truncate opacity-70" style={smText.styles}>
							{content.description}
						</p>
					)}
				</div>
			</div>
		</a>
	);
};

interface TSingleContentProps {
	node: TResolvedLinkNode<TResolvedSingleLinkNodeContent>;
	cx: TResolvedNodeProps<TResolvedLinkNode<TResolvedSingleLinkNodeContent>>['cx'];
}
