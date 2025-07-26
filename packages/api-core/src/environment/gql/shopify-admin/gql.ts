import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env.js';

export const gql = initGraphQLTada<{
	introspection: introspection;
	scalars: TScalarTypes;
}>();

export { readFragment } from 'gql.tada';
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';

interface TScalarTypes {
	/** An Amazon Resource Name (ARN)
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/arn
	 */
	ARN: string;

	/** A 64-bit signed integer
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/bigint
	 */
	BigInt: string;

	/** A boolean value
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/boolean
	 */
	Boolean: boolean;

	/** A color string (e.g., "#FFFFFF")
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/color
	 */
	Color: string;

	/** ISO 8601-encoded date string (e.g., "2019-09-07")
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/date
	 */
	Date: string;

	/** ISO 8601-encoded date and time string (e.g., "2019-09-07T15:50:00Z")
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/datetime
	 */
	DateTime: string;

	/** A signed decimal number, with optional thousands separators and up to 2 decimal places
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/decimal
	 */
	Decimal: string;

	/** A floating point number
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/float
	 */
	Float: number;

	/** A string that may contain formatting options
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/formattedstring
	 */
	FormattedString: string;

	/** A string containing HTML code
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/html
	 */
	HTML: string;

	/** A unique identifier
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/id
	 */
	ID: string;

	/** A 32-bit signed integer
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/int
	 */
	Int: number;

	/** A string containing JSON
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/json
	 */
	JSON: string;

	/** A monetary value string (e.g., "100.00")
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/money
	 */
	Money: string;

	/** A storefront ID string
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/storefrontid
	 */
	StorefrontID: string;

	/** A UTF-8 string
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/string
	 */
	String: string;

	/** An unsigned 64-bit integer
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/unsignedint64
	 */
	UnsignedInt64: string;

	/** RFC 3986 and RFC 3987-compliant URI string
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/url
	 */
	URL: string;

	/** A UTC offset string (e.g., "-05:00")
	 * @see https://shopify.dev/docs/api/admin-graphql/latest/scalars/utcoffset
	 */
	UtcOffset: string;
}
