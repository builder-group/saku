import { evaluateSync } from '@mdx-js/mdx';
import React from 'react';
import { logger } from '@/environment';
import { TResolvedNodeProps } from '../../../../lib';
import { TResolvedRichTextNodeBundle } from '../../types';

export const ResolvedRichBundle = React.forwardRef<HTMLDivElement, TResolvedRichBundleProps>(
	(props, ref) => {
		const {
			node: { content, autoLayout, appearance, fill, stroke, shadow, text }
		} = props;

		const mdxComponents = React.useMemo(
			() => createMdxComponents(text.typography.fontSize),
			[text.typography.fontSize]
		);

		// Use evaluateSync for SSR because async (e.g. with React Query) wouldn't render on server
		const textContent = React.useMemo(() => {
			switch (content.text.type) {
				case 'text': {
					return <p>{content.text.value}</p>;
				}
				case 'markdown': {
					const textValue = content.text.value;
					if (textValue.trim() === '') {
						return null;
					}

					try {
						const { default: Component } = evaluateSync(textValue, {
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
						return <span>{textValue}</span>;
					}
				}
				case 'html': {
					return <div dangerouslySetInnerHTML={{ __html: content.text.value }} />;
				}
			}
		}, [content.text, mdxComponents]);

		return (
			<div
				ref={ref}
				style={{
					...autoLayout.styles,
					...appearance.styles,
					...fill?.styles,
					...stroke?.styles,
					...shadow?.styles
				}}
			>
				<div className="flex h-full min-h-12 w-full flex-col justify-center" style={text.styles}>
					{textContent}
				</div>
			</div>
		);
	}
);
ResolvedRichBundle.displayName = 'ResolvedRichBundle';

interface TResolvedRichBundleProps {
	node: TResolvedRichTextNodeBundle;
	cx: TResolvedNodeProps<TResolvedRichTextNodeBundle>['cx'];
}

const createMdxComponents = (baseFontSize: number): Record<string, React.ComponentType<any>> => ({
	h1: (props) => (
		<h1
			className="mt-6 mb-4 font-bold first:mt-0 last:mb-0"
			style={{ fontSize: baseFontSize * 1.875 }}
			{...props}
		/>
	),
	h2: (props) => (
		<h2
			className="mt-5 mb-3 font-semibold first:mt-0 last:mb-0"
			style={{ fontSize: baseFontSize * 1.5 }}
			{...props}
		/>
	),
	h3: (props) => (
		<h3
			className="mt-4 mb-2 font-semibold first:mt-0 last:mb-0"
			style={{ fontSize: baseFontSize * 1.25 }}
			{...props}
		/>
	),
	h4: (props) => (
		<h4
			className="mt-3 mb-2 font-semibold first:mt-0 last:mb-0"
			style={{ fontSize: baseFontSize * 1.125 }}
			{...props}
		/>
	),
	h5: (props) => (
		<h5
			className="mt-2 mb-1 font-semibold first:mt-0 last:mb-0"
			style={{ fontSize: baseFontSize }}
			{...props}
		/>
	),
	h6: (props) => (
		<h6
			className="mt-2 mb-1 font-semibold first:mt-0 last:mb-0"
			style={{ fontSize: baseFontSize * 0.875 }}
			{...props}
		/>
	),
	p: (props) => <p className="mb-2 first:mt-0 last:mb-0" {...props} />,
	ul: (props) => <ul className="mb-2 list-disc pl-6 first:mt-0 last:mb-0" {...props} />,
	ol: (props) => <ol className="mb-2 list-decimal pl-6 first:mt-0 last:mb-0" {...props} />,
	li: (props) => <li className="mb-1 first:mt-0 last:mb-0" {...props} />,
	a: (props) => <a className="text-blue-600 underline hover:text-blue-800" {...props} />,
	blockquote: (props) => (
		<blockquote
			className="my-4 border-l-4 border-neutral-300 pl-4 text-gray-600 italic first:mt-0 last:mb-0"
			{...props}
		/>
	),
	hr: (props) => <hr className="my-6 border-neutral-200 first:mt-0 last:mb-0" {...props} />,
	code: (props) => (
		<code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-sm" {...props} />
	),
	pre: (props) => (
		<pre
			className="my-4 overflow-x-auto rounded bg-neutral-900 p-3 text-gray-100 first:mt-0 last:mb-0"
			{...props}
		/>
	),
	em: (props) => <em className="italic" {...props} />,
	strong: (props) => <strong className="font-bold" {...props} />
});
