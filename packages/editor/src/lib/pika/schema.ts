import { z } from 'zod';

/**
 * Zod v4 schema for validating a Pika ID with a specific prefix.
 *
 * @param prefix - The required prefix for the Pika ID (e.g., 'user', 'product')
 * @returns Zod schema that validates `${prefix}_${base64}`
 *
 * @example
 *   const userIdSchema = createPikaIdSchema('user');
 *   userIdSchema.parse('user_MTIzNDU2Nzg5MDEy'); // ✅
 *   userIdSchema.parse('product_MTIzNDU2Nzg5MDEy'); // ❌
 *   userIdSchema.parse('a81bc81b-dead-4e5d-abff-90865d1e13b1'); // ❌
 */
export function createPikaIdSchema(prefix: string): z.ZodString {
	return z.string().refine(
		(val) => {
			if (!val.startsWith(`${prefix}_`)) {
				return false;
			}
			const base64Part = val.slice(prefix.length + 1);
			try {
				z.base64().parse(base64Part);
				return true;
			} catch {
				return false;
			}
		},
		{
			message: `ID must start with "${prefix}_" and be followed by a valid base64 string`
		}
	);
}

/**
 * Zod v4 schema for any valid Pika ID (any prefix, base64 snowflake).
 * Format: <prefix>_<base64>
 */
export const pikaIdSchema = z.string().refine(
	(val) => {
		const underscore = val.indexOf('_');
		if (underscore < 1) {
			return false;
		}
		const base64Part = val.slice(underscore + 1);
		try {
			z.base64().parse(base64Part);
			return true;
		} catch {
			return false;
		}
	},
	{
		message: 'Invalid Pika ID: must be <prefix>_<base64>'
	}
);

export type TPikaId<GPrefix extends string = string> = `${GPrefix}_${string}`;
