import { data, isRouteErrorResponse, useRouteError } from '@remix-run/react';
import React from 'react';

export function useErrorData<
	GData extends TErrorData = TErrorData
>(): TUseErrorDataResponse<GData> {
	const routeError = useRouteError();

	return React.useMemo(() => {
		// Handle route error responses (from throw data())
		if (isRouteErrorResponse(routeError)) {
			return Object.assign(
				{
					isRouteError: true
				},
				routeError.data
			);
		}

		// Handle Error instances
		if (routeError instanceof Error) {
			return {
				isRouteError: false,
				message: routeError.message
			};
		}

		// Handle unknown errors
		return {
			isRouteError: false,
			message: 'An unknown error occurred'
		};
	}, [routeError]);
}

export type TUseErrorDataResponse<GData extends TErrorData = TErrorData> =
	| ({
			isRouteError: true;
	  } & GData)
	| {
			isRouteError: false;
			message: string;
	  };

export function ErrorData<GErrorData extends TErrorData = TErrorData>(
	errorData: GErrorData,
	init?: number | ResponseInit
) {
	return data(errorData, init);
}

export interface TErrorData {
	code: `#ERR_${string}`;
	message: string;
}
