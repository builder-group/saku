import React from 'react';
import { useLoaderData } from 'react-router';
import { fromArray, match, TResultArray } from 'tuple-result';
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

	return () => {
		const loaderData = useLoaderData<TResultArray<GSuccess, GError>>();
		const result = React.useMemo(() => {
			return fromArray<GSuccess, GError>(loaderData as TResultArray<GSuccess, GError>);
		}, [loaderData]);

		return match(result, {
			ok: (data) => <Success data={data} />,
			err: (error) => (Error != null ? <Error error={error} /> : null)
		});
	};
}

export interface TWithResultLoaderConfig<GSuccess, GError> {
	Success: React.ComponentType<{ data: GSuccess }>;
	Error?: React.ComponentType<{ error: GError }>;
}

export function resultLoader<GSuccess, GError>(
	loaderFn: TLoaderFunction<TResultArray<GSuccess, GError>>
): TLoaderFunction<TResultArray<GSuccess, GError>> {
	return loaderFn;
}
