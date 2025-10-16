import { getContactKey } from '@repo/editor';
import React from 'react';
import { contactIconMap } from '../../../../environment';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedClassicAboutNodeBundle } from '../../types';

export const ResolvedClassicBundle = React.forwardRef<HTMLDivElement, TResolvedClassicBundleProps>(
	(props, ref) => {
		const {
			node: { content, autoLayout, appearance, fill, stroke, shadow, textXl, text, image }
		} = props;

		return (
			<div
				ref={ref}
				className="relative overflow-hidden"
				style={{
					...autoLayout.styles,
					...appearance.styles,
					...fill?.styles,
					...stroke?.styles,
					...shadow?.styles
				}}
			>
				<div className="flex flex-col items-center gap-6">
					{/* Avatar */}
					{content.avatar != null ? (
						<div className="h-24 w-24 overflow-hidden" style={image.styles}>
							<img
								src={content.avatar.src}
								alt={content.title}
								className="h-full w-full object-cover"
								draggable={false}
							/>
						</div>
					) : (
						<div
							className="flex h-20 w-20 items-center justify-center bg-neutral-200 text-gray-500"
							style={image.styles}
						>
							{content.title.charAt(0).toUpperCase()}
						</div>
					)}

					<div className="flex flex-col items-center gap-0.5 px-6">
						{/* Name */}
						<h1 className="font-semibold" style={textXl.styles}>
							{content.title}
						</h1>

						{/* Bio */}
						{content.description != null && (
							<p className="leading-relaxed" style={text.styles}>
								{content.description}
							</p>
						)}
					</div>

					{/* Contact Icons */}
					{content.contactLinks.length > 0 && (
						<div className="flex flex-wrap justify-center gap-4">
							{content.contactLinks.map((contactLink) => {
								const action = contactLink.action;
								const contactKey = getContactKey(action);

								const IconComponent = contactIconMap[contactKey];
								if (IconComponent == null) {
									return null;
								}

								return (
									<a
										key={contactLink.id}
										href={action.url}
										target={action.type === 'social' ? '_blank' : undefined}
										rel={action.type === 'social' ? 'noopener noreferrer' : undefined}
										className="flex h-7 w-7 items-center justify-center hover:opacity-70"
										style={{
											color: text.styles.color
										}}
										title={contactLink.title}
									>
										<IconComponent className="h-full w-full" />
									</a>
								);
							})}
						</div>
					)}
				</div>
			</div>
		);
	}
);
ResolvedClassicBundle.displayName = 'ResolvedClassicBundle';

interface TResolvedClassicBundleProps {
	node: TResolvedClassicAboutNodeBundle;
	cx: TResolvedNodeProps<TResolvedClassicAboutNodeBundle>['cx'];
}
