export class EditorError extends Error {
	public readonly code: TEditorErrorCode;
	public readonly detail?: string;
	public readonly throwable?: Error;
	public readonly errors: Record<string, unknown>[];
	public readonly errorStack: EditorError[];

	constructor(code: TEditorErrorCode, options: TEditorErrorOptions = {}) {
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
		const errorConstructor = Error as ErrorConstructor & {
			captureStackTrace?: (targetObject: object) => void;
		};
		errorConstructor.captureStackTrace?.(this);
	}

	public wrapWith(
		code: TEditorErrorCode,
		options: Omit<TEditorErrorOptions, 'errorStack'> = {}
	): EditorError {
		return new EditorError(code, {
			...options,
			errorStack: [this, ...this.errorStack]
		});
	}

	public toEditorErrorDto(): TEditorErrorDto {
		return {
			code: this.code,
			detail: this.detail,
			errors: this.errors.length > 0 ? this.errors : undefined,
			errorStack:
				this.errorStack.length > 0
					? this.errorStack.map((error) => error.toEditorErrorDto())
					: undefined
		};
	}

	public static fromEditorErrorDto(dto: TEditorErrorDto): EditorError {
		return new EditorError(dto.code as TEditorErrorCode, {
			detail: dto.detail,
			errors: dto.errors,
			errorStack: dto.errorStack?.map((errorDto) => EditorError.fromEditorErrorDto(errorDto)) ?? []
		});
	}
}

export interface TEditorErrorOptions {
	detail?: string;
	throwable?: Error;
	errors?: Record<string, unknown>[];
	errorStack?: EditorError[];
}

export type TEditorErrorCode = `#ERR_${string}`;

export interface TEditorErrorDto {
	code: TEditorErrorCode;
	detail?: string;
	errors?: Record<string, unknown>[];
	errorStack?: TEditorErrorDto[];
}
