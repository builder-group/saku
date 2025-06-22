import { AppError, errorHandler as utilsErrorHandler } from '@repo/hono-utils';
import type * as hono from 'hono/types';
import { DatabaseError } from 'pg';
import { logger } from '@/environment';

export const errorHandler: hono.ErrorHandler = async (err, c) => {
	if (err instanceof DatabaseError) {
		logger.error('Database error', {
			throwable: err,
			errors: [
				{
					code: err.code,
					message: err.message,
					detail: err.detail
				}
			]
		});
		return utilsErrorHandler(
			new AppError('#ERR_INTERNAL_SERVER_ERROR', 500, {
				title: 'Internal server error'
			}),
			c
		);
	}

	if (err instanceof AppError) {
		logger.error(`Error: ${err.code} (${err.status})`);
	}

	return utilsErrorHandler(err, c);
};
