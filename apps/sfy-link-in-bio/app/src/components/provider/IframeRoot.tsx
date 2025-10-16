import React from 'react';
import { createPortal } from 'react-dom';

export const IframeRoot: React.FC<TIframeRootProps> = (props) => {
	const { children, links, onStylesLoaded, ...iframeProps } = props;

	const iframeRef = React.useRef<HTMLIFrameElement>(null);
	const [iframeDocument, setIframeDocument] = React.useState<Document | null>(null);

	const loadedCount = React.useRef(0);

	React.useLayoutEffect(() => {
		const iframe = iframeRef.current;
		if (iframe == null || iframeDocument != null) {
			return;
		}

		const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
		if (doc == null) {
			return;
		}

		setIframeDocument(doc);
	}, [iframeDocument]);

	const handleLinkLoad = React.useCallback(() => {
		loadedCount.current += 1;
		if (loadedCount.current === links.length) {
			onStylesLoaded?.();
		}
	}, [onStylesLoaded, links.length]);

	return (
		<iframe ref={iframeRef} {...iframeProps}>
			{iframeDocument != null && (
				<>
					{createPortal(
						<>
							{links.map((link, i) => (
								<link key={i} {...link} onLoad={handleLinkLoad} />
							))}
						</>,
						iframeDocument.head
					)}
					{createPortal(children, iframeDocument.body)}
				</>
			)}
		</iframe>
	);
};

export interface TIframeRootLink {
	rel: string;
	href: string;
	[key: string]: unknown;
}

export interface TIframeRootProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
	children: React.ReactNode;
	links: TIframeRootLink[];
	onStylesLoaded?: () => void;
}
