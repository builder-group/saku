import { useLocation } from 'react-router';
import posthog from 'posthog-js';
import React from 'react';
import { usePosthogDistinctIdSync } from './use-posthog-distinct-id-sync';

export function usePosthogPageView() {
	const location = useLocation();
	const previousLocation = React.useRef<string | null>(null);

	usePosthogDistinctIdSync();

	React.useEffect(() => {
		if (previousLocation.current !== location.pathname) {
			posthog.capture('$pageview', {
				$current_url: location.pathname,
				$pathname: location.pathname,
				$search: location.search
			});
			previousLocation.current = location.pathname;
		}
	}, [location.pathname, location.search]);
}
