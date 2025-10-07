import { EditorError } from '@repo/editor';
import { FetchError } from 'feature-fetch';

export class AppError extends Error {
	public readonly code: TErrorCode;
	public readonly detail?: string;
	public readonly throwable?: Error;
	public readonly errors: Record<string, unknown>[];
	public readonly errorStack: AppError[];

	constructor(code: TErrorCode, options: TAppErrorOptions = {}) {
		const {
			detail = options.throwable?.message ?? 'An error occurred.',
			throwable,
			errors = [],
			errorStack = []
		} = options;

		super(`[${code}] ${detail}`);
		this.code = code;
		this.detail = detail;
		this.throwable = throwable;
		this.errors = errors;
		this.errorStack = errorStack;

		// https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance
		Error.captureStackTrace(this);
	}

	public wrapWith(code: TErrorCode, options: Omit<TAppErrorOptions, 'errorStack'> = {}): AppError {
		return new AppError(code, {
			...options,
			errorStack: [this, ...this.errorStack]
		});
	}

	public toAppErrorDto(): TAppErrorDto {
		return {
			code: this.code,
			detail: this.detail,
			errors: this.errors.length > 0 ? this.errors : undefined,
			errorStack:
				this.errorStack.length > 0
					? this.errorStack.map((error) => error.toAppErrorDto())
					: undefined
		};
	}

	public static fromAppErrorDto(dto: TAppErrorDto): AppError {
		return new AppError(dto.code as TErrorCode, {
			detail: dto.detail,
			errors: dto.errors,
			errorStack: dto.errorStack?.map((errorDto) => AppError.fromAppErrorDto(errorDto)) ?? []
		});
	}

	public static fromEditorError(error: EditorError): AppError {
		return new AppError(error.code, {
			detail: error.detail,
			errors: error.errors,
			errorStack: error.errorStack.map((error) => AppError.fromEditorError(error))
		});
	}

	public static fromFetchError(error: FetchError): AppError {
		return new AppError(error.code, {
			detail: error.message,
			throwable: error.throwable
		});
	}
}

export interface TAppErrorOptions {
	detail?: string;
	throwable?: Error;
	errors?: Record<string, unknown>[];
	errorStack?: AppError[];
}

export type TErrorCode = `#ERR_${string}`;

export interface TAppErrorDto {
	code: TErrorCode;
	detail?: string;
	errors?: Record<string, unknown>[];
	errorStack?: TAppErrorDto[];
}
