import {
	HeadersFunction,
	LinksFunction,
	type ActionFunctionArgs,
	type LoaderFunctionArgs
} from '@remix-run/node';

export type TLoaderFunction<GResponse = null> = (args: LoaderFunctionArgs) => Promise<GResponse>;

export type TActionFunction<GResponse = null> = (args: ActionFunctionArgs) => Promise<GResponse>;

export type TLinksFunction = LinksFunction;

export type THeadersFunction = HeadersFunction;

export interface TError {
	code: `#ERR_${string}`;
	message: string;
}
