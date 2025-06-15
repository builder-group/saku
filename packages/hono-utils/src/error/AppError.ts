export class AppError extends Error {
	public readonly code: TErrorCode;
	public readonly status: number;
	public readonly throwable?: Error;

	// RFC 7807 fields
	public readonly type: string;
	public readonly title: string;
	public readonly detail?: string;
	public readonly instance?: string;
	public readonly errors: Record<string, unknown>[];

	constructor(code: TErrorCode, status: number, options: TAppErrorOptions = {}) {
		const {
			type = 'about:blank',
			title = code,
			detail = options.throwable?.message ?? 'An error occurred.',
			throwable,
			instance,
			errors = []
		} = options;

		super(`[${code}] ${detail}`);
		this.code = code;
		this.status = status;
		this.throwable = throwable;
		this.type = type;
		this.title = title;
		this.detail = detail;
		this.instance = instance;
		this.errors = errors;

		// https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance
		Error.captureStackTrace(this);
	}
}

export type TErrorCode = `#ERR_${string}`;

export interface TAppErrorOptions {
	detail?: string;
	throwable?: Error;
	type?: string; // URI reference to docs
	instance?: string; // e.g. the current request path
	errors?: Record<string, unknown>[];
	title?: string; // human-readable summary
}
