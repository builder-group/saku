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

			// ga4EventName maps to GA4 recommended events (view_item, add_to_cart) which unlock
			// built-in reports and Google Ads. send_to scopes to this property when multiple
			// gtag destinations exist on the same page.
			// Ref: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
			if (ga4MeasurementId != null && typeof window.gtag === 'function') {
				window.gtag('event', event.ga4EventName ?? event.name, {
					...event.properties,
					saku_event: event.name,
					send_to: ga4MeasurementId
				});
			}

			// trackSingle/trackSingleCustom target only this pixel, not all initialized pixels.
			// Standard events (ViewContent, AddToCart) via trackSingle unlock Meta ad optimization.
			// Ref: https://developers.facebook.com/docs/meta-pixel/reference#standard-events
			if (metaPixelId != null && typeof window.fbq === 'function') {
				const metaProperties = { ...event.properties, saku_event: event.name };
				if (event.metaPixelEventName != null) {
					window.fbq('trackSingle', metaPixelId, event.metaPixelEventName, metaProperties);
				} else {
					window.fbq('trackSingleCustom', metaPixelId, event.name, metaProperties);
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
	// GA4 recommended e-commerce event name (view_item, add_to_cart, select_item).
	// Overrides `name` to unlock GA4 built-in reports and Google Ads conversion tracking.
	// Ref: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
	ga4EventName?: string;
	// Meta Pixel standard event name (ViewContent, AddToCart).
	// Uses trackSingle instead of trackSingleCustom, enabling Meta ad optimization.
	// Ref: https://developers.facebook.com/docs/meta-pixel/reference#standard-events
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
