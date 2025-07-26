import { fromServerResult, ServerErr, TServerResult } from '@blgc/utils';
import React from 'react';
import { Await, useLoaderData } from 'react-router';
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
		const loaderData = useLoaderData<TDeferredLoaderData<GSuccess, GError>>();

		return (
			<React.Suspense fallback={Loading != null ? <Loading /> : null}>
				<Await resolve={loaderData.next}>
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
	Error?: React.ComponentType<{ error: TDeferredError<GError> }>;
	Loading?: React.ComponentType;
}

/**
 * Makes a loader function deferred for consistent async handling.
 * Required when using withDeferredLoader.
 *
 * Note: deferLoader doesn't work with redirects (throw redirect).
 * For redirects, create custom loader returning TDeferredLoaderData instead.
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
			// Note: Using resolve instead of reject to avoid hydration mismatches (when using errorElement)
			next: new Promise<TServerResult<GSuccess, TDeferredError<GError>>>((resolve) => {
				// Timeout to ensure the promise resolves before React Router's 4950ms threshold (which leads to rejected promise)
				// https://reactrouter.com/how-to/suspense#timeouts
				const timeoutId = setTimeout(() => {
					resolve(
						ServerErr({ __type: 'defer-error', code: '#ERR_TIMEOUT', message: 'Request timed out' })
					);
				}, 4500);

				loaderFn(args)
					.then((res) => {
						clearTimeout(timeoutId);
						resolve(res);
					})
					.catch((err) => {
						clearTimeout(timeoutId);
						resolve(
							ServerErr({ __type: 'defer-error', code: '#ERR_SERVER_ERROR', message: err.message })
						);
					});
			})
		};
	};
}

export interface TDeferredLoaderData<GSuccess, GError> {
	next: Promise<TServerResult<GSuccess, TDeferredError<GError>>>;
}

export type TDeferredError<GError> = GError | TDeferError;

export interface TDeferError {
	readonly __type: 'defer-error';
	code: `#ERR_${string}`;
	message: string;
}

export function isDeferError(error: unknown): error is TDeferError {
	return (
		error != null &&
		typeof error === 'object' &&
		'__type' in error &&
		error.__type === 'defer-error'
	);
}
