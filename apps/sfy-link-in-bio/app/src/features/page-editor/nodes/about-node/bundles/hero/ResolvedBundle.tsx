import { getContactKey } from '@repo/editor';
import React from 'react';
import { contactIconMap } from '../../../../environment';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedHeroAboutNodeBundle } from '../../types';

const fadeGradient =
	'radial-gradient(110.26% 96% at 50% 0%, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0.99) 54.68%, rgba(0, 0, 0, 0.97) 58.79%, rgba(0, 0, 0, 0.94) 62.4%, rgba(0, 0, 0, 0.9) 65.61%, rgba(0, 0, 0, 0.85) 68.52%, rgba(0, 0, 0, 0.79) 71.2%, rgba(0, 0, 0, 0.72) 73.75%, rgba(0, 0, 0, 0.65) 76.25%, rgba(0, 0, 0, 0.57) 78.8%, rgba(0, 0, 0, 0.48) 81.48%, rgba(0, 0, 0, 0.39) 84.39%, rgba(0, 0, 0, 0.3) 87.6%, rgba(0, 0, 0, 0.2) 91.21%, rgba(0, 0, 0, 0.1) 95.32%, rgba(0, 0, 0, 0) 100%)';

export const ResolvedHeroBundle = React.forwardRef<HTMLDivElement, TResolvedHeroBundleProps>(
	(props, ref) => {
		const {
			node: { content, autoLayout, appearance, fill, stroke, shadow, textHeading, textBody }
		} = props;

		return (
			<div
				ref={ref}
				className="relative overflow-hidden"
				style={{
					margin: autoLayout.styles.margin,
					...appearance.styles,
					...fill?.styles,
					...stroke?.styles,
					...shadow?.styles
				}}
			>
				{/* Hero Image Background */}
				{content.avatar != null ? (
					<img
						src={content.avatar.src}
						alt={content.title}
						className="aspect-square w-full object-cover"
						draggable={false}
						fetchPriority="high"
						style={{
							mask: fadeGradient,
							WebkitMask: fadeGradient
						}}
					/>
				) : (
					<div
						className="flex aspect-square w-full items-center justify-center bg-neutral-200 text-6xl font-semibold text-gray-500"
						style={{
							mask: fadeGradient,
							WebkitMask: fadeGradient
						}}
					>
						{content.title.charAt(0).toUpperCase()}
					</div>
				)}

				{/* Content Container */}
				<div
					className="isolate -mt-20 flex flex-col items-center gap-6"
					style={{ padding: autoLayout.styles.padding }}
				>
					{/* Title & Description */}
					<div className="flex flex-col items-center gap-1 px-6">
						<h1
							className="text-center leading-tight font-semibold wrap-break-word"
							style={textHeading.styles}
						>
							{content.title}
						</h1>
						{content.description != null && (
							<p className="text-center leading-relaxed text-balance" style={textBody.styles}>
								{content.description}
							</p>
						)}
					</div>

					{/* Contact Icons */}
					{content.contactLinks.length > 0 && (
						<div className="flex flex-wrap justify-center gap-4 px-6">
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
											color: textBody.styles.color
										}}
										title={contactLink.altText}
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
ResolvedHeroBundle.displayName = 'ResolvedHeroBundle';

interface TResolvedHeroBundleProps {
	node: TResolvedHeroAboutNodeBundle;
	cx: TResolvedNodeProps<TResolvedHeroAboutNodeBundle>['cx'];
}
