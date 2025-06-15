import type * as hono from 'hono/types';
import { AppError } from '../AppError';

export const invalidPathHandler: hono.NotFoundHandler = (c) => {
	throw new AppError('#ERR_PATH_NOT_FOUND', 404, {
		title: 'Path not found',
		detail: `The specified path '${c.req.path}' does not exist!`
	});
};
