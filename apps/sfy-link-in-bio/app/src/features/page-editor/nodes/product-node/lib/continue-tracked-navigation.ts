import type React from 'react';

const TRACKED_NAVIGATION_DELAY_MS = 150;

/**
 * Give analytics a brief moment to flush before same-tab navigation unloads the page.
 */
export function continueTrackedNavigation(config: TContinueTrackedNavigationConfig): void {
	const { event, url, target = '_self' } = config;

	if (
		target !== '_self' ||
		event.defaultPrevented ||
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey
	) {
		return;
	}

	event.preventDefault();

	window.setTimeout(() => {
		window.location.assign(url);
	}, TRACKED_NAVIGATION_DELAY_MS);
}

interface TContinueTrackedNavigationConfig {
	event: React.MouseEvent<HTMLAnchorElement>;
	url: string;
	target?: '_blank' | '_self';
}
