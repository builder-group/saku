import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env.js';

export const gql = initGraphQLTada<{
	introspection: introspection;
	scalars: TScalarTypes;
}>();

export { readFragment } from 'gql.tada';
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';

interface TScalarTypes {
	/**
	 * Represents `true` or `false` values.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/boolean
	 */
	Boolean: boolean;

	/**
	 * A hexadecimal color code (e.g., "#FFFFFF").
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/color
	 */
	Color: string;

	/**
	 * An ISO 8601-encoded date and time string (e.g., "2024-06-14T12:34:56Z").
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/datetime
	 */
	DateTime: string;

	/**
	 * A string representing a decimal value.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/decimal
	 */
	Decimal: string;

	/**
	 * A signed double-precision floating-point value.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/float
	 */
	Float: number;

	/**
	 * A string containing HTML code.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/html
	 */
	HTML: string;

	/**
	 * A unique identifier, often used to refetch an object or as a cache key.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/id
	 */
	ID: string;

	/**
	 * A signed 32‐bit integer.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/int
	 */
	Int: number;

	/**
	 * An ISO 8601-encoded date and time string (e.g., "2024-06-14T12:34:56Z").
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/iso8601datetime
	 */
	ISO8601DateTime: string;

	/**
	 * A JSON-serializable value.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/json
	 */
	JSON: any;

	/**
	 * A UTF-8 character sequence.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/string
	 */
	String: string;

	/**
	 * An unsigned 64-bit integer.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/unsignedint64
	 */
	UnsignedInt64: string;

	/**
	 * A valid URL string.
	 * @see https://shopify.dev/docs/api/storefront/latest/scalars/url
	 */
	URL: string;
}
