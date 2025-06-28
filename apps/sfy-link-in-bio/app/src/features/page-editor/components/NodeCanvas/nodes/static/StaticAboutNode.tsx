import React from 'react';
import { socialIconMap } from '../../../../environment';
import { TPageEditor } from '../../../../lib';
import { TAboutNode } from '../../../../types';

export const StaticAboutNode = React.forwardRef<HTMLDivElement, TStaticAboutNodeProps>(
	(props, ref) => {
		const { node, editor, ...divProps } = props;

		// Style calculations with inheritance
		const style = React.useMemo(() => {
			const pageNode = editor.getRootNode()._v;

			function resolveStyle<T>(value: T | 'inherit' | undefined, fallback?: T): T | undefined {
				if (value === 'inherit') return fallback;
				return value ?? fallback;
			}

			return {
				padding: resolveStyle(node.style.padding, pageNode?.style.children?.padding),
				margin: resolveStyle(node.style.margin, pageNode?.style.children?.margin),
				backgroundColor: resolveStyle(
					node.style.backgroundColor,
					pageNode?.style.children?.backgroundColor
				),
				fontFamily: resolveStyle(node.style.fontFamily, pageNode?.style.children?.fontFamily),
				fontSize: resolveStyle(node.style.fontSize, pageNode?.style.children?.fontSize),
				textColor: resolveStyle(node.style.textColor, pageNode?.style.children?.textColor),
				textAlign: resolveStyle(node.style.textAlign, pageNode?.style.children?.textAlign),
				borderRadius: resolveStyle(node.style.borderRadius, pageNode?.style.children?.borderRadius),
				shadow: resolveStyle(node.style.shadow, pageNode?.style.children?.shadow)
			};
		}, [node.style, editor]);

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
						fontFamily: style.fontFamily,
						fontSize: style.fontSize ? style.fontSize * 1.25 : undefined, // Scale up for title
						color: style.textColor,
						textAlign: style.textAlign
					}}
				>
					{node.name}
				</h1>

				{/* Bio */}
				{node.bio && (
					<p
						className="text-center leading-relaxed"
						style={{
							fontFamily: style.fontFamily,
							fontSize: style.fontSize,
							color: style.textColor,
							textAlign: style.textAlign
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
				{style.backgroundColor ? (
					// Card style with background
					<div
						className="relative overflow-hidden"
						style={{
							padding: style.padding,
							margin: style.margin,
							backgroundColor: style.backgroundColor,
							borderRadius: style.borderRadius,
							boxShadow: style.shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
						}}
					>
						{content}
					</div>
				) : (
					// Flat style without background
					<div
						style={{
							padding: style.padding,
							margin: style.margin
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
	node: TAboutNode;
	editor: TPageEditor;
}
