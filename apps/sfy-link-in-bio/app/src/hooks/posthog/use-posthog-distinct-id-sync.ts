import { useLoaderData } from 'react-router';
import posthog from 'posthog-js';
import React from 'react';

export function usePosthogDistinctIdSync() {
	const loaderData = useLoaderData<{ distinctId: string }>();

	React.useEffect(() => {
		if (loaderData.distinctId == null || posthog.get_distinct_id() === loaderData.distinctId) {
			return;
		}

		posthog.identify(loaderData.distinctId);
	}, [loaderData.distinctId]);
}
