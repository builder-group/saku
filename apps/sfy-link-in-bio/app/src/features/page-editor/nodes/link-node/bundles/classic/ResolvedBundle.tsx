import React from 'react';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedClassicLinkNodeBundle } from '../../types';

export const ResolvedClassicBundle = React.forwardRef<HTMLDivElement, TResolvedClassicBundleProps>(
	(props, ref) => {
		const {
			node: { content, autoLayout, appearance, fill, stroke, shadow, text, textSm, image }
		} = props;

		return (
			<div ref={ref}>
				<a
					href={content.url}
					target="_blank"
					rel="noopener noreferrer"
					className="flex cursor-pointer hover:opacity-90"
					style={{
						...autoLayout.styles,
						...appearance.styles,
						...fill?.styles,
						...stroke?.styles,
						...shadow?.styles
					}}
				>
					<div className="flex min-h-12 w-full flex-row items-center gap-2">
						{content.thumbnail != null && (
							<div
								className="h-12 w-12 flex-shrink-0 overflow-hidden bg-neutral-100"
								style={image.styles}
							>
								<img
									src={content.thumbnail.src}
									alt={content.title ?? 'Featured Image'}
									className="h-full w-full object-cover"
									draggable={false}
								/>
							</div>
						)}

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
					</div>
				</a>
			</div>
		);
	}
);
ResolvedClassicBundle.displayName = 'ResolvedClassicBundle';

interface TResolvedClassicBundleProps {
	node: TResolvedClassicLinkNodeBundle;
	cx: TResolvedNodeProps<TResolvedClassicLinkNodeBundle>['cx'];
}
