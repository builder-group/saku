import {
	ClientLoaderFunction,
	HeadersFunction,
	LinksFunction,
	LoaderFunction,
	MetaFunction,
	type ActionFunctionArgs,
	type LoaderFunctionArgs
} from 'react-router';

export type TLoaderFunction<GResponse = null> = (args: LoaderFunctionArgs) => Promise<GResponse>;

export type TActionFunction<GResponse = null> = (args: ActionFunctionArgs) => Promise<GResponse>;

export type TLinksFunction = LinksFunction;

export type THeadersFunction = HeadersFunction;

export type TMetaFunction<
	GLoader extends LoaderFunction | ClientLoaderFunction | unknown = unknown,
	GMatchLoaders extends Record<string, LoaderFunction | ClientLoaderFunction | unknown> = Record<
		string,
		unknown
	>
> = MetaFunction<GLoader, GMatchLoaders>;

export interface TError {
	code: `#ERR_${string}`;
	message: string;
}
