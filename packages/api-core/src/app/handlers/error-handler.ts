import { AppError, errorHandler as errorHandlerUtils } from '@repo/hono-utils';
import type * as hono from 'hono/types';
import { DatabaseError } from 'pg';

export const errorHandler: hono.ErrorHandler = async (err, c) => {
	if (err instanceof DatabaseError) {
		return errorHandlerUtils(
			new AppError('#ERR_DATABASE', 500, {
				title: 'Database error',
				throwable: err,
				errors: [
					{
						code: err.code,
						message: err.message,
						detail: err.detail
					}
				]
			}),
			c
		);
	}

	return errorHandlerUtils(err, c);
};
