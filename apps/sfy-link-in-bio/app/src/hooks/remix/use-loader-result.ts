import { fromServerResult } from '@blgc/utils';
import { useLoaderData } from 'react-router';
import React from 'react';

export function useLoaderResult<T, E>() {
	const loaderData = useLoaderData();

	return React.useMemo(() => {
		return fromServerResult<T, E>(loaderData as any);
	}, [loaderData]);
}
