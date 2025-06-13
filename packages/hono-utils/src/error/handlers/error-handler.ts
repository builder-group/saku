import { HTTPException } from 'hono/http-exception';
import type * as hono from 'hono/types';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import type { TAppErrorDto } from '@/openapi';
import { AppError } from '../AppError';

type HeaderRecord = Record<string, string | string[]>;

export const errorHandler: hono.ErrorHandler = async (err, c) => {
	let statusCode = 500;
	let headers: HeaderRecord = {};
	const jsonResponse: TAppErrorDto = {
		type: 'about:blank',
		title: 'Internal Server Error',
		status: 500,
		code: '#ERR_UNKNOWN',
		detail: 'An unknown error occurred',
		instance: c.req.path,
		errors: []
	};

	// AppError → RFC 7807
	if (err instanceof AppError) {
		statusCode = err.status;
		jsonResponse.type = err.type;
		jsonResponse.title = err.title;
		jsonResponse.status = err.status;
		jsonResponse.code = err.code;
		jsonResponse.detail = err.detail;
		jsonResponse.instance = err.instance ?? c.req.path;
		jsonResponse.errors = err.errors;
	}

	// Hono HTTPException
	else if (err instanceof HTTPException) {
		const response = err.getResponse();
		statusCode = response.status;

		jsonResponse.status = response.status;
		jsonResponse.code = `#ERR_HTTP_${response.status}`;
		jsonResponse.title = 'HTTP Error';
		jsonResponse.detail = await response.text();
		jsonResponse.instance = c.req.path;

		const newHeaders = Object.fromEntries(response.headers.entries());
		delete newHeaders['content-type'];
		headers = newHeaders;
	}

	// Unknown object
	else if (typeof err === 'object' && err !== null) {
		if ('message' in err && typeof err.message === 'string') {
			jsonResponse.detail = err.message;
		}
		if ('code' in err && typeof err.code === 'string') {
			jsonResponse.code = err.code;
		}
	}

	return c.json(jsonResponse, statusCode as ContentfulStatusCode, headers);
};
