import { FetchError } from 'feature-fetch';
import { appConfig } from '@/environment';
import { AppError } from '../AppError';

/**
 * Creates a mailto URL for contacting support with error details
 */
export function createSupportEmailUrl(config: TCreateSupportEmailUrlConfig): string {
	const { error, subjectPrefix, additionalInfo = {} } = config;
	const timestamp = new Date().toISOString();

	const errorDetails = {
		code: error.code ?? '#ERR_UNKNOWN',
		message: error.message ?? 'An unknown error occurred',
		description: error instanceof FetchError ? error.message : undefined,
		throwable: error instanceof FetchError ? error.throwable?.message : undefined,
		...additionalInfo
	};

	const subject =
		subjectPrefix != null
			? `${subjectPrefix} Error ${errorDetails.code}`
			: `Error ${errorDetails.code}`;

	const bodyParts = [
		'Error details:',
		`  Code: ${errorDetails.code}`,
		`  Message: ${errorDetails.message}`,
		`  Description: ${errorDetails.description ?? 'N/A'}`,
		`  Timestamp: ${timestamp}`,
		...Object.entries(additionalInfo).map(([key, value]) => `  ${key}: ${value}`),
		`  Throwable: ${JSON.stringify(errorDetails.throwable) ?? 'N/A'}`
	];
	const body = bodyParts.join('\n');

	return `mailto:${appConfig.help.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export interface TCreateSupportEmailUrlConfig {
	error: AppError;
	subjectPrefix?: string;
	additionalInfo?: Record<string, string | undefined>;
}
