import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedClassicLinkNodeBundle } from '../../types';

export const ClassicContent: React.FC<TSingleContentProps> = (props) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, text, textSm, image }
	} = props;

	return (
		<a
			href={content.url}
			target="_blank"
			rel="noopener noreferrer"
			className="relative flex min-h-12 w-full cursor-pointer flex-row items-center gap-2 overflow-hidden bg-white text-inherit no-underline hover:opacity-90"
			style={{
				...autoLayout.styles,
				...appearance.styles,
				...fill?.styles,
				...stroke?.styles,
				...shadow?.styles
			}}
		>
			{/* Featured Image */}
			{content.image != null && (
				<div
					className="h-12 w-12 flex-shrink-0 overflow-hidden bg-neutral-100"
					style={image.styles}
				>
					<img
						src={content.image.src}
						alt={content.title ?? 'Featured Image'}
						className="h-full w-full object-cover"
						draggable={false}
					/>
				</div>
			)}

			{/* Link Details */}
			<div className="flex w-full min-w-0 flex-col gap-1">
				{content.title != null && (
					<p className="truncate font-medium" style={text.styles}>
						{content.title}
					</p>
				)}
				{content.description != null && (
					<p className="truncate opacity-70" style={textSm.styles}>
						{content.description}
					</p>
				)}
			</div>
		</a>
	);
};

interface TSingleContentProps {
	node: TResolvedClassicLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedClassicLinkNodeBundle>['cx'];
}
