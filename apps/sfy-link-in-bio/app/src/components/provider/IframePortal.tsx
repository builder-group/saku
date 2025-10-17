import React from 'react';
import { createPortal } from 'react-dom';

export const IframePortal = React.forwardRef<HTMLIFrameElement, TIframePortalProps>(
	(props, forwardedRef) => {
		const { children, links, onStylesLoaded, ...iframeProps } = props;

		const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
		const [iframeDocument, setIframeDocument] = React.useState<Document | null>(null);
		const [iframeWindow, setIframeWindow] = React.useState<Window | null>(null);

		const loadedCount = React.useRef(0);

		React.useLayoutEffect(() => {
			const iframe = iframeRef.current;
			if (iframe == null || iframeDocument != null) {
				return;
			}

			const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
			const win = iframe.contentWindow;
			if (doc == null || win == null) {
				return;
			}

			setIframeDocument(doc);
			setIframeWindow(win);
		}, [iframeDocument]);

		const handleLinkLoad = React.useCallback(() => {
			loadedCount.current += 1;
			if (loadedCount.current === links.length) {
				onStylesLoaded?.();
			}
		}, [onStylesLoaded, links.length]);

		return (
			<iframe
				ref={(node) => {
					iframeRef.current = node;
					if (typeof forwardedRef === 'function') {
						forwardedRef(node);
					} else if (forwardedRef) {
						forwardedRef.current = node;
					}
				}}
				{...iframeProps}
			>
				{iframeDocument != null && iframeWindow != null && (
					<>
						{createPortal(
							<>
								{links.map((link, i) => (
									<link key={i} {...link} onLoad={handleLinkLoad} />
								))}
							</>,
							iframeDocument.head
						)}
						{createPortal(
							<IframePortalProvider iframeDocument={iframeDocument} iframeWindow={iframeWindow}>
								{children}
							</IframePortalProvider>,
							iframeDocument.body
						)}
					</>
				)}
			</iframe>
		);
	}
);
IframePortal.displayName = 'IframePortal';

export interface TIframePortalProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
	children: React.ReactNode;
	links: TIframePortalLink[];
	onStylesLoaded?: () => void;
}

export interface TIframePortalLink {
	rel: string;
	href: string;
	[key: string]: unknown;
}

const IframePortalContext = React.createContext<TIframePortalContextValue>(null);

type TIframePortalContextValue = {
	window: Window;
	document: Document;
} | null;

const IframePortalProvider: React.FC<TIframePortalProviderProps> = (props) => {
	const { children, iframeDocument, iframeWindow } = props;

	return (
		<IframePortalContext.Provider
			value={{
				window: iframeWindow,
				document: iframeDocument
			}}
		>
			{children}
		</IframePortalContext.Provider>
	);
};

interface TIframePortalProviderProps {
	children: React.ReactNode;
	iframeDocument: Document;
	iframeWindow: Window;
}

export function useIframePortal(): TIframePortalContextValue {
	return React.useContext(IframePortalContext);
}
