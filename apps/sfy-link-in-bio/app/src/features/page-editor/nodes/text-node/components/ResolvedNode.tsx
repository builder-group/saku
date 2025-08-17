import { evaluateSync } from '@mdx-js/mdx';
import React from 'react';
import { logger } from '@/environment';
import { TResolvedNodeProps } from '../../../lib';
import { TResolvedTextNode } from '../types';

export const ResolvedTextNode = React.forwardRef<
	HTMLDivElement,
	TResolvedNodeProps<TResolvedTextNode>
>((props, ref) => {
	const {
		node: { content, layout, appearance, typography, fill, stroke, shadow },
		...divProps
	} = props;

	// Use evaluateSync for SSR
	// because async (e.g. with React Query) wouldn't render on server
	const mdxContent = React.useMemo(() => {
		if (content.text.trim() === '') {
			return null;
		}

		try {
			const { default: Component } = evaluateSync(content.text, {
				jsx: React.createElement,
				jsxs: React.createElement,
				Fragment: React.Fragment,
				// Prevents MDX from including debug objects (fileName, lineNumber, columnNumber)
				// that React tries to render as children,
				// causing "Objects are not valid as a React child" errors during SSR.
				// Debug info breaks serialization between server and client.
				development: false
			});

			return Component({ components: mdxComponents });
		} catch (error) {
			logger.warn('MDX parsing error:', error);
			return <span>{content.text}</span>;
		}
	}, [content.text]);

	return (
		<div {...divProps} ref={ref} className="w-full max-w-md">
			<div
				className="relative overflow-hidden"
				style={{
					padding: layout?.padding,
					opacity: appearance.opacity,
					backgroundColor: fill?.paint.type === 'solid' ? fill?.paint.color : undefined,
					borderRadius: appearance?.borderRadius,
					boxShadow: shadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : undefined
				}}
			>
				<div
					className="flex min-h-12 w-full flex-col justify-start p-4"
					style={{
						fontFamily: typography?.font?.family,
						fontSize: typography?.fontSize,
						color: typography?.textColor,
						textAlign: typography?.textAlign
					}}
				>
					{mdxContent}
				</div>
			</div>
		</div>
	);
});
ResolvedTextNode.displayName = 'ResolvedTextNode';

const mdxComponents: Record<string, React.ComponentType<any>> = {
	h1: (props) => <h1 className="mt-6 mb-4 text-3xl font-bold first:mt-0 last:mb-0" {...props} />,
	h2: (props) => (
		<h2 className="mt-5 mb-3 text-2xl font-semibold first:mt-0 last:mb-0" {...props} />
	),
	h3: (props) => <h3 className="mt-4 mb-2 text-xl font-semibold first:mt-0 last:mb-0" {...props} />,
	h4: (props) => <h4 className="mt-3 mb-2 text-lg font-semibold first:mt-0 last:mb-0" {...props} />,
	h5: (props) => (
		<h5 className="mt-2 mb-1 text-base font-semibold first:mt-0 last:mb-0" {...props} />
	),
	h6: (props) => <h6 className="mt-2 mb-1 text-sm font-semibold first:mt-0 last:mb-0" {...props} />,
	p: (props) => <p className="mb-2 first:mt-0 last:mb-0" {...props} />,
	ul: (props) => <ul className="mb-2 list-disc pl-6 first:mt-0 last:mb-0" {...props} />,
	ol: (props) => <ol className="mb-2 list-decimal pl-6 first:mt-0 last:mb-0" {...props} />,
	li: (props) => <li className="mb-1 first:mt-0 last:mb-0" {...props} />,
	a: (props) => <a className="text-blue-600 underline hover:text-blue-800" {...props} />,
	blockquote: (props) => (
		<blockquote
			className="my-4 border-l-4 border-gray-300 pl-4 text-gray-600 italic first:mt-0 last:mb-0"
			{...props}
		/>
	),
	hr: (props) => <hr className="my-6 border-gray-200 first:mt-0 last:mb-0" {...props} />,
	code: (props) => (
		<code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm" {...props} />
	),
	pre: (props) => (
		<pre
			className="my-4 overflow-x-auto rounded bg-gray-900 p-3 text-gray-100 first:mt-0 last:mb-0"
			{...props}
		/>
	),
	em: (props) => <em className="italic" {...props} />,
	strong: (props) => <strong className="font-bold" {...props} />
};
