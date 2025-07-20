import { fromServerResult, TServerResult } from '@blgc/utils';
import { Await, useLoaderData } from '@remix-run/react';
import React from 'react';
import { TLoaderFunction } from '../../types';

/**
 * A HOC that handles deferred loader data with automatic loading states.
 * Requires the loader to be wrapped with deferLoader.
 *
 * @example
 * ```tsx
 * // Required: Make your loader deferred
 * export const loader = deferLoader<TSuccessData, TErrorData>(async ({ request }) => {
 *   const data = await fetchData();
 *   return ServerOk(data);
 * });
 *
 * // Required: Handle deferred loader data
 * export default withDeferredLoader<TSuccessData, TErrorData>({
 *   Success: ({ data }) => <div>{data.whatever}</div>,
 *   Error: ({ error }) => <div>{error.message}</div>,
 *   Loading: () => <div>Loading...</div>
 * });
 * ```
 */
export function withDeferredLoader<GSuccess, GError>(
	config: TWithDeferredLoaderConfig<GSuccess, GError>
): React.FC {
	const { Success, Error, Loading } = config;

	// eslint-disable-next-line react/display-name
	return () => {
		const { promisedResult } = useLoaderData<TDeferredLoaderData<GSuccess, GError>>();

		return (
			<React.Suspense fallback={Loading != null ? <Loading /> : null}>
				<Await resolve={promisedResult}>
					{(resolvedResult) => {
						const result = React.useMemo(() => {
							return fromServerResult<GSuccess, GError>(resolvedResult as any);
						}, [resolvedResult]);

						if (result.isErr()) {
							return Error != null ? <Error error={result.error} /> : null;
						}

						return <Success data={result.value} />;
					}}
				</Await>
			</React.Suspense>
		);
	};
}

export interface TWithDeferredLoaderConfig<GSuccess, GError> {
	Success: React.ComponentType<{ data: GSuccess }>;
	Error?: React.ComponentType<{ error: GError }>;
	Loading?: React.ComponentType;
}

/**
 * Makes a loader function deferred for consistent async handling.
 * Required when using withDeferredLoader for automatic loading states.
 *
 * @example
 * ```tsx
 * export const loader = deferLoader<TSuccessData, TErrorData>(async ({ request }) => {
 *   const data = await fetchData();
 *   return ServerOk(data);
 * });
 * ```
 */
export function deferLoader<GSuccess, GError>(
	loaderFn: TLoaderFunction<TServerResult<GSuccess, GError>>
): TLoaderFunction<TDeferredLoaderData<GSuccess, GError>> {
	return async (args) => {
		return {
			promisedResult: loaderFn(args)
		};
	};
}

export interface TDeferredLoaderData<GSuccess, GError> {
	promisedResult: Promise<TServerResult<GSuccess, GError>>;
}
