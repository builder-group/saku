import { AppError, errorHandler as honoUtilsErrorHandler } from '@repo/hono-utils';
import type * as hono from 'hono/types';
import { DatabaseError } from 'pg';
import { logger } from '@/environment';

export const errorHandler: hono.ErrorHandler = async (err, c) => {
	// Handle app error
	if (err instanceof AppError) {
		const logThrowable =
			err.status === 500 ||
			(err.code === '#ERR_VALIDATION_FAILED' && c.req.path.includes('/webhook/'));
		logger.error(
			`[AppError] ${err.message}`,
			...(logThrowable ? [{ throwable: JSON.stringify(err) }] : [])
		);

		return honoUtilsErrorHandler(err, c);
	}

	// Handle database error and mask it as internal server error
	if (err instanceof DatabaseError) {
		logger.error(`[DatabaseError] ${err.message}`, {
			throwable: JSON.stringify(err)
		});
		return honoUtilsErrorHandler(
			new AppError('#ERR_INTERNAL_SERVER_ERROR', 500, {
				title: 'Internal server error'
			}),
			c
		);
	}

	// Handle generic error instance
	if (err instanceof Error) {
		// Handle database error and mask it as internal server error
		if (err.message.startsWith('Failed query:')) {
			logger.error(`[DatabaseError] ${err.message}`, {
				throwable: JSON.stringify(err)
			});
			return honoUtilsErrorHandler(
				new AppError('#ERR_INTERNAL_SERVER_ERROR', 500, {
					title: 'Internal server error'
				}),
				c
			);
		}

		// Handle unknown error
		logger.error(`[Error] ${err.message}`, {
			throwable: JSON.stringify(err)
		});
		return honoUtilsErrorHandler(err, c);
	}

	// Handle unknown error
	return honoUtilsErrorHandler(err, c);
};
