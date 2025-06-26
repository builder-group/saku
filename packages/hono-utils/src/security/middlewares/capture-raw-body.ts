import type { Context, MiddlewareHandler } from 'hono';

/**
 * Middleware to capture and store the raw request body.
 *
 * Access the raw body via:
 * ```ts
 * const rawBody = c.get('rawRequestBody') as TRawRequestBody;
 * const textData = rawBody.text(); // Convert to string
 * const binaryData = rawBody.bytes(); // Get as Uint8Array
 * ```
 */
export const captureRawBodyMiddleware: MiddlewareHandler = async (
	c: Context,
	next: () => Promise<void>
): Promise<void> => {
	c.set('rawRequestBody', {
		data: await c.req.raw.clone().arrayBuffer(), // Clone the request to preserve the original body
		contentType: c.req.header('content-type') ?? null,
		text(encoding: BufferEncoding = 'utf8') {
			return Buffer.from(this.data).toString(encoding);
		},
		bytes() {
			return new Uint8Array(this.data);
		}
	} satisfies TRawRequestBody);

	await next();
};

export type TRawRequestBody = {
	/** The raw request body as ArrayBuffer (preserves exact bytes) */
	data: ArrayBuffer;
	/** The content-type header value (e.g., 'application/json; charset=utf-8') */
	contentType: string | null;
	/** Convert raw data to text using specified or default encoding */
	text: (encoding?: BufferEncoding) => string;
	/** Get the raw data as Uint8Array for easier manipulation */
	bytes: () => Uint8Array;
};
