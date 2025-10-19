import React from 'react';
import { createPortal } from 'react-dom';

export const ShadowPortal: React.FC<TShadowPortalProps> = (props) => {
	const { children, links, onStylesLoaded, ...divProps } = props;

	const hostRef = React.useRef<HTMLDivElement>(null);
	const [shadowRoot, setShadowRoot] = React.useState<ShadowRoot | null>(null);

	const loadedCount = React.useRef(0);

	React.useLayoutEffect(() => {
		const host = hostRef.current;
		if (host == null || shadowRoot != null) {
			return;
		}

		if (host.shadowRoot == null) {
			setShadowRoot(host.attachShadow({ mode: 'open' }));
		} else {
			setShadowRoot(host.shadowRoot);
		}
	}, [shadowRoot]);

	const handleLinkLoad = React.useCallback(() => {
		loadedCount.current += 1;
		if (loadedCount.current === links.length) {
			onStylesLoaded?.();
		}
	}, [onStylesLoaded, links.length]);

	return (
		<div ref={hostRef} {...divProps}>
			{shadowRoot != null &&
				createPortal(
					<>
						{links.map((link, i) => (
							<link key={i} {...link} onLoad={handleLinkLoad} />
						))}
						{children}
					</>,
					shadowRoot
				)}
		</div>
	);
};

export interface TShadowPortalProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	links: TShadowPortalLink[];
	onStylesLoaded?: () => void;
}

export interface TShadowPortalLink {
	rel: string;
	href: string;
	[key: string]: unknown;
}
