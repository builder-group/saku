export class AppError extends Error {
	public readonly code: TErrorCode;
	public readonly detail?: string;
	public readonly throwable?: Error;
	public readonly errors: Record<string, unknown>[];

	constructor(code: TErrorCode, options: TAppErrorOptions = {}) {
		const {
			detail = options.throwable?.message ?? 'An error occurred.',
			throwable,
			errors = []
		} = options;

		super(`[${code}] ${detail}`);
		this.code = code;
		this.detail = detail;
		this.throwable = throwable;
		this.errors = errors;

		// https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance
		Error.captureStackTrace(this);
	}

	toAppErrorDto(): TAppErrorDto {
		return {
			code: this.code,
			detail: this.detail,
			errors: this.errors.length > 0 ? this.errors : undefined
		};
	}

	static fromAppErrorDto(dto: TAppErrorDto): AppError {
		return new AppError(dto.code as TErrorCode, {
			detail: dto.detail,
			errors: dto.errors
		});
	}
}

export interface TAppErrorOptions {
	detail?: string;
	throwable?: Error;
	errors?: Record<string, unknown>[];
}

export type TErrorCode = `#ERR_${string}`;

export interface TAppErrorDto {
	code: TErrorCode;
	detail?: string;
	errors?: Record<string, unknown>[];
}
