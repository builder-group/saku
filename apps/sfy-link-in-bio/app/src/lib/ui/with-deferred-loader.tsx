import React from 'react';
import { Await, useLoaderData } from 'react-router';
import { Err, TResultArray } from 'tuple-result';
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
					{([isOk, error, data]) => {
						if (!isOk) {
							return Error != null ? <Error error={error} /> : null;
						}

						return <Success data={data} />;
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
	loaderFn: TLoaderFunction<TResultArray<GSuccess, GError>>
): TLoaderFunction<TDeferredLoaderData<GSuccess, GError>> {
	return async (args) => {
		return {
			// Note: Using resolve instead of reject to avoid hydration mismatches (when using errorElement)
			next: new Promise<TResultArray<GSuccess, TDeferredError<GError>>>((resolve) => {
				// Timeout to ensure the promise resolves before React Router's 4950ms threshold (which leads to rejected promise)
				// https://reactrouter.com/how-to/suspense#timeouts
				const timeoutId = setTimeout(() => {
					resolve(
						Err({
							__type: 'defer-error' as const,
							code: '#ERR_TIMEOUT' as const,
							message: 'Request timed out'
						}).toArray()
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
							Err({
								__type: 'defer-error' as const,
								code: '#ERR_SERVER_ERROR' as const,
								message: err.message
							}).toArray()
						);
					});
			})
		};
	};
}

export interface TDeferredLoaderData<GSuccess, GError> {
	next: Promise<TResultArray<GSuccess, TDeferredError<GError>>>;
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
