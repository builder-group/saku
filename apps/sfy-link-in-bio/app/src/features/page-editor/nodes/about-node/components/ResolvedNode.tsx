import React from 'react';
import { TResolvedNodeProps } from '../../../lib/node/types';
import { socialIconMap } from '../social-icon';
import { TResolvedAboutNode } from '../types';

export const ResolvedAboutNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedAboutNode>
>((props, ref) => {
	const {
		node: { content, autoLayout, appearance, fill, stroke, shadow, text },
		...divProps
	} = props;

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			<div
				className="relative overflow-hidden"
				style={{
					...autoLayout.styles,
					...appearance.styles,
					...fill?.styles,
					...stroke?.styles,
					...shadow?.styles
				}}
			>
				<div className="flex flex-col items-center gap-4">
					{/* Avatar */}
					{content.profilePicture != null ? (
						<div className="h-20 w-20 overflow-hidden rounded-full">
							<img
								src={content.profilePicture.src}
								alt={content.name}
								className="h-full w-full object-cover"
								draggable={false}
							/>
						</div>
					) : (
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-500">
							{content.name.charAt(0).toUpperCase()}
						</div>
					)}

					{/* Name */}
					<h1
						className="font-semibold"
						style={{
							...text.styles,
							fontSize: text.typography.fontSize * 1.25 // Scale up for title
						}}
					>
						{content.name}
					</h1>

					{/* Bio */}
					{content.bio != null && (
						<p className="leading-relaxed" style={text.styles}>
							{content.bio}
						</p>
					)}

					{/* Social Links */}
					{content.socialLinks.length > 0 && (
						<div className="flex flex-wrap justify-center gap-4">
							{content.socialLinks.map((social) => {
								const IconComponent = socialIconMap[social.provider];
								if (IconComponent == null) {
									return null;
								}

								return (
									<a
										key={social.id}
										href={social.url || `#${social.handle}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex h-6 w-6 items-center justify-center hover:opacity-70"
										style={{
											color: text.styles.color
										}}
										title={`${social.provider}: ${social.handle}`}
									>
										<IconComponent className="h-full w-full" />
									</a>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
});
ResolvedAboutNode.displayName = 'ResolvedAboutNode';
