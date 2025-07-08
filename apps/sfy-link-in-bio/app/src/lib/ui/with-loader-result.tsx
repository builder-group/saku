import React from 'react';
import { useLoaderResult } from '@/hooks';

/**
 * A simple HOC that handles loader result patterns.
 * This follows KISS principles and avoids using error boundaries for control flow.
 *
 * @example
 * ```tsx
 * export default withLoaderResult<TSuccessData, TErrorData>({
 *   Success: ({ data }) => {
 *     // Access data.whatever directly
 *     return <div>{data.whatever}</div>;
 *   },
 *   Error: ({ error }) => {
 *     return <div>{error.message}</div>;
 *   },
 *   Loading: () => {
 *     return <div>Loading...</div>;
 *   }
 * });
 * ```
 */
export function withLoaderResult<TSuccess, TError>(
	config: TWithLoaderResultConfig<TSuccess, TError>
): React.FC {
	const { Success, Error, Loading } = config;

	return function WithLoaderResult() {
		return (
			<React.Suspense fallback={Loading != null ? <Loading /> : null}>
				<WithLoaderResultInner Success={Success} Error={Error} />
			</React.Suspense>
		);
	};
}

export interface TWithLoaderResultConfig<TSuccess, TError> {
	Success: React.ComponentType<{ data: TSuccess }>;
	Error?: React.ComponentType<{ error: TError }>;
	Loading?: React.ComponentType;
}

const WithLoaderResultInner = <TSuccess, TError>(
	props: TWithLoaderInnerProps<TSuccess, TError>
) => {
	const { Success, Error } = props;
	const result = useLoaderResult<TSuccess, TError>();

	if (result.isErr()) {
		return Error != null ? <Error error={result.error} /> : null;
	}

	return <Success data={result.value} />;
};

interface TWithLoaderInnerProps<TSuccess, GError> {
	Success: TWithLoaderResultConfig<TSuccess, GError>['Success'];
	Error?: TWithLoaderResultConfig<TSuccess, GError>['Error'];
}
