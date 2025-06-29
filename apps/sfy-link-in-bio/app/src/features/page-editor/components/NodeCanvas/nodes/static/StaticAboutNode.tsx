import React from 'react';
import { socialIconMap } from '../../../../environment';
import { TResolvedAboutNode } from '../../../../types';

export const StaticAboutNode = React.forwardRef<HTMLDivElement, TStaticAboutNodeProps>(
	(props, ref) => {
		const { node, ...divProps } = props;

		// Content component
		const content = (
			<div className="flex flex-col items-center gap-4">
				{/* Avatar */}
				{node.media?.url ? (
					<div className="h-20 w-20 overflow-hidden rounded-full">
						<img
							src={node.media.url}
							alt={node.media.altText || node.name}
							className="h-full w-full object-cover"
							draggable={false}
						/>
					</div>
				) : (
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-500">
						{node.name.charAt(0).toUpperCase()}
					</div>
				)}

				{/* Name */}
				<h1
					className="text-xl font-semibold"
					style={{
						fontFamily: node.style.fontFamily,
						fontSize:
							typeof node.style.fontSize === 'number' ? node.style.fontSize * 1.25 : undefined, // Scale up for title
						color: node.style.textColor,
						textAlign: node.style.textAlign
					}}
				>
					{node.name}
				</h1>

				{/* Bio */}
				{node.bio && (
					<p
						className="text-center leading-relaxed"
						style={{
							fontFamily: node.style.fontFamily,
							fontSize: node.style.fontSize,
							color: node.style.textColor,
							textAlign: node.style.textAlign
						}}
					>
						{node.bio}
					</p>
				)}

				{/* Social Links */}
				{node.socialLinks && node.socialLinks.length > 0 && (
					<div className="flex flex-wrap justify-center gap-3">
						{node.socialLinks.map((social) => {
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
									className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
									title={`${social.provider}: ${social.handle}`}
								>
									<IconComponent className="h-5 w-5" />
								</a>
							);
						})}
					</div>
				)}
			</div>
		);

		return (
			<div {...divProps} ref={ref} className="w-full max-w-md">
				{node.style.backgroundColor ? (
					// Card style with background
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
						{content}
					</div>
				) : (
					// Flat style without background
					<div
						style={{
							padding: node.style.padding,
							margin: node.style.margin
						}}
					>
						{content}
					</div>
				)}
			</div>
		);
	}
);
StaticAboutNode.displayName = 'StaticAboutNode';

interface TStaticAboutNodeProps extends React.HTMLProps<HTMLDivElement> {
	node: TResolvedAboutNode;
}
