export function createTrackingContext(config: TCreateTrackingContextConfig): TTrackingContext {
	const { enabled } = config;
	const normalizedGa4Id = normalizeGa4MeasurementId(config.ga4MeasurementId);
	const ga4MeasurementId = isValidGa4MeasurementId(normalizedGa4Id) ? normalizedGa4Id : undefined;
	const normalizedPixelId = normalizeMetaPixelId(config.metaPixelId);
	const metaPixelId = isValidMetaPixelId(normalizedPixelId) ? normalizedPixelId : undefined;

	return {
		ga4MeasurementId,
		metaPixelId,
		trackEvent(event) {
			if (!enabled || typeof window === 'undefined') {
				return;
			}

			// send_to scopes the event to this specific GA4 property.
			// Required when multiple gtag destinations are configured on the same page.
			// Docs: https://developers.google.com/tag-platform/gtagjs/reference#event
			if (ga4MeasurementId != null && typeof window.gtag === 'function') {
				window.gtag('event', event.name, { ...event.properties, send_to: ga4MeasurementId });
			}

			// trackSingle/trackSingleCustom scope the event to only the specified pixel ID.
			// Preferred over track/trackCustom (which fire all initialized pixels) since
			// we explicitly know which pixel this site belongs to.
			// Standard events (e.g. ViewContent, AddToCart) use trackSingle and unlock
			// Meta ad optimization. Custom events fall back to trackSingleCustom.
			// Docs: https://developers.facebook.com/docs/meta-pixel/reference#standard-events
			if (metaPixelId != null && typeof window.fbq === 'function') {
				if (event.metaPixelEventName != null) {
					window.fbq('trackSingle', metaPixelId, event.metaPixelEventName, event.properties);
				} else {
					window.fbq('trackSingleCustom', metaPixelId, event.name, event.properties);
				}
			}
		}
	};
}

export type TCreateTrackingContextConfig = {
	ga4MeasurementId: string | undefined;
	metaPixelId: string | undefined;
	enabled: boolean;
};

export interface TTrackingContext {
	ga4MeasurementId: string | undefined;
	metaPixelId: string | undefined;
	trackEvent(event: TPageTrackingEvent): void;
}

export interface TPageTrackingEvent {
	name: 'outbound_link_click' | 'product_cta_click' | 'product_detail_view';
	// When set, fires as a Meta Pixel standard event (trackSingle) which unlocks ad optimization.
	// Omit for custom events (trackSingleCustom). GA4 always uses `name` regardless.
	// Standard event reference: https://developers.facebook.com/docs/meta-pixel/reference#standard-events
	metaPixelEventName?: string;
	properties: Record<string, string | number | boolean | undefined>;
}

export function normalizeGa4MeasurementId(value: string | undefined): string | undefined {
	const trimmedValue = value?.trim().toUpperCase();
	return trimmedValue != null && trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function isValidGa4MeasurementId(value: string | undefined): value is string {
	return value != null && /^G-[A-Z0-9]+$/.test(value);
}

export function normalizeMetaPixelId(value: string | undefined): string | undefined {
	const trimmedValue = value?.trim();
	return trimmedValue != null && trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function isValidMetaPixelId(value: string | undefined): value is string {
	return value != null && /^[0-9]+$/.test(value);
}
