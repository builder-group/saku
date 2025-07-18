import React from 'react';
import { socialIconMap } from '../../../../environment';
import { TResolvedAboutNode } from '../../../../types';
import { TStaticNodeProps } from '../types';

export const StaticAboutNode = React.forwardRef<
	HTMLDivElement,
	TStaticNodeProps<TResolvedAboutNode>
>((props, ref) => {
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
							fontFamily: style.font?.family,
							fontSize: typeof style.fontSize === 'number' ? style.fontSize * 1.25 : undefined, // Scale up for title
							color: style.textColor,
							textAlign: style.textAlign
						}}
					>
						{content.name}
					</h1>

					{/* Bio */}
					{content.bio != null && (
						<p
							className="text-center leading-relaxed"
							style={{
								fontFamily: style.font?.family,
								fontSize: style.fontSize,
								color: style.textColor,
								textAlign: style.textAlign
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
											color: style.textColor
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
StaticAboutNode.displayName = 'StaticAboutNode';
