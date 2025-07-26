import { fromServerResult } from '@blgc/utils';
import React from 'react';
import { useLoaderData } from 'react-router';

export function useLoaderResult<T, E>() {
	const loaderData = useLoaderData();

	return React.useMemo(() => {
		return fromServerResult<T, E>(loaderData as any);
	}, [loaderData]);
}
