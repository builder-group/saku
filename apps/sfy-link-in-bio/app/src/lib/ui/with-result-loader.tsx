import { fromServerResult, TServerResult } from '@blgc/utils';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import { TLoaderFunction } from '../../types';

/**
 * A HOC that handles direct loader results with success and error states.
 * Works with loaders that return TServerResult directly.
 *
 * @example
 * ```tsx
 * export const loader = async ({ request }) => {
 *   const data = await fetchData();
 *   return ServerOk(data);
 * };
 *
 * export default withResultLoader<TSuccessData, TErrorData>({
 *   Success: ({ data }) => <div>{data.whatever}</div>,
 *   Error: ({ error }) => <div>{error.message}</div>
 * });
 * ```
 */
export function withResultLoader<GSuccess, GError>(
	config: TWithResultLoaderConfig<GSuccess, GError>
): React.FC {
	const { Success, Error } = config;

	// eslint-disable-next-line react/display-name
	return () => {
		const loaderData = useLoaderData<TServerResult<GSuccess, GError>>();
		const result = React.useMemo(() => {
			return fromServerResult<GSuccess, GError>(loaderData as TServerResult<GSuccess, GError>);
		}, [loaderData]);

		if (result.isErr()) {
			return Error != null ? <Error error={result.error} /> : null;
		}

		return <Success data={result.value} />;
	};
}

export interface TWithResultLoaderConfig<GSuccess, GError> {
	Success: React.ComponentType<{ data: GSuccess }>;
	Error?: React.ComponentType<{ error: GError }>;
}

export function resultLoader<GSuccess, GError>(
	loaderFn: TLoaderFunction<TServerResult<GSuccess, GError>>
): TLoaderFunction<TServerResult<GSuccess, GError>> {
	return loaderFn;
}
