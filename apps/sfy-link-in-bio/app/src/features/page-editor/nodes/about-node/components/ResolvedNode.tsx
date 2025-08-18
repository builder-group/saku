import React from 'react';
import { TResolvedNodeProps } from '../../../lib/node/types';
import { socialIconMap } from '../social-icon';
import { TResolvedAboutNode } from '../types';

export const ResolvedAboutNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedAboutNode>
>((props, ref) => {
	const {
		node: { content, layout, appearance, typography, fill, stroke, shadow },
		...divProps
	} = props;

	if (appearance?.visible === false) {
		return null;
	}

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			<div
				className="relative overflow-hidden"
				style={{
					padding: layout?.padding,
					opacity: appearance.opacity,
					backgroundColor: fill?.paint?.type === 'solid' ? fill.paint.color : undefined,
					borderRadius: appearance.borderRadius,
					boxShadow: shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
				}}
			>
				<div className="flex flex-col items-center gap-4">
					{/* Avatar */}
					{content.profilePicture != null ? (
						<div className="h-20 w-20 overflow-hidden rounded-full">
							<img
								src={content.profilePicture}
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
						className="text-xl font-semibold"
						style={{
							fontFamily: typography.font.family,
							fontSize: typography.fontSize * 1.25, // Scale up for title
							color: typography.textColor,
							textAlign: typography.textAlign
						}}
					>
						{content.name}
					</h1>

					{/* Bio */}
					{content.bio != null && (
						<p
							className="text-center leading-relaxed"
							style={{
								fontFamily: typography.font.family,
								fontSize: typography.fontSize,
								color: typography.textColor,
								textAlign: typography.textAlign
							}}
						>
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
											color: typography.textColor
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
