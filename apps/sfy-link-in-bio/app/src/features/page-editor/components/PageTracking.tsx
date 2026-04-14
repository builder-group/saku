import React from 'react';
import {
	isValidGa4MeasurementId,
	isValidMetaPixelId,
	normalizeGa4MeasurementId,
	normalizeMetaPixelId,
	TPageContext,
	TPageTrackingEvent
} from '../lib';

const initializedGa4Ids = new Set<string>();
const initializedMetaPixelIds = new Set<string>();

export const PageTracking: React.FC<TPageTrackingProps> = (props) => {
	const { cx } = props;
	const ga4MeasurementId = React.useMemo(
		() => normalizeGa4MeasurementId(cx.integrations.ga4?.measurementId),
		[cx.integrations.ga4?.measurementId]
	);
	const metaPixelId = React.useMemo(
		() => normalizeMetaPixelId(cx.integrations.metaPixel?.pixelId),
		[cx.integrations.metaPixel?.pixelId]
	);

	React.useEffect(() => {
		if (!isValidGa4MeasurementId(ga4MeasurementId) || typeof window === 'undefined') {
			return;
		}

		window.dataLayer = window.dataLayer || [];
		window.gtag =
			window.gtag ||
			function gtag(...args: unknown[]) {
				window.dataLayer?.push(args);
			};

		if (!document.querySelector('script[data-saku-ga4="true"]')) {
			const script = document.createElement('script');
			script.async = true;
			script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`;
			script.dataset['sakuGa4'] = 'true';
			document.head.appendChild(script);
		}

		if (!initializedGa4Ids.has(ga4MeasurementId)) {
			window.gtag('js', new Date());
			initializedGa4Ids.add(ga4MeasurementId);
		}

		window.gtag('config', ga4MeasurementId, {
			page_location: window.location.href,
			page_path: window.location.pathname
		});
	}, [ga4MeasurementId]);

	React.useEffect(() => {
		if (!isValidMetaPixelId(metaPixelId) || typeof window === 'undefined') {
			return;
		}

		if (window.fbq == null) {
			const fbq: TFacebookPixelFn = (...args: unknown[]) => {
				if (typeof fbq.callMethod === 'function') {
					fbq.callMethod(...args);
				} else {
					fbq.queue?.push(args);
				}
			};

			fbq.queue = [];
			fbq.loaded = true;
			fbq.version = '2.0';
			window.fbq = fbq;
		}

		if (!document.querySelector('script[data-saku-meta-pixel="true"]')) {
			const script = document.createElement('script');
			script.async = true;
			script.src = 'https://connect.facebook.net/en_US/fbevents.js';
			script.dataset['sakuMetaPixel'] = 'true';
			document.head.appendChild(script);
		}

		if (!initializedMetaPixelIds.has(metaPixelId)) {
			window.fbq('init', metaPixelId);
			initializedMetaPixelIds.add(metaPixelId);
		}

		window.fbq('trackSingle', metaPixelId, 'PageView');
	}, [metaPixelId]);

	React.useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const handleTrackEvent = (event: Event) => {
			const detail = (event as CustomEvent<TPageTrackingEvent>).detail;
			if (detail == null) {
				return;
			}

			if (isValidGa4MeasurementId(ga4MeasurementId) && typeof window.gtag === 'function') {
				window.gtag('event', detail.name, {
					...detail.properties,
					send_to: ga4MeasurementId
				});
			}
			if (isValidMetaPixelId(metaPixelId) && typeof window.fbq === 'function') {
				window.fbq('trackSingleCustom', metaPixelId, detail.name, detail.properties);
			}
		};

		window.addEventListener('saku:track', handleTrackEvent as EventListener);
		return () => {
			window.removeEventListener('saku:track', handleTrackEvent as EventListener);
		};
	}, [ga4MeasurementId, metaPixelId]);

	return null;
};

interface TPageTrackingProps {
	cx: TPageContext;
}

type TFacebookPixelFn = ((...args: unknown[]) => void) & {
	callMethod?: (...args: unknown[]) => void;
	queue?: unknown[][];
	loaded?: boolean;
	version?: string;
};
