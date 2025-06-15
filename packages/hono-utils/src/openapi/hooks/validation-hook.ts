import { OpenAPIHonoOptions } from '@hono/zod-openapi';
import { AppError } from '@/error';

export const validationHook: OpenAPIHonoOptions<any>['defaultHook'] = (result) => {
	if (!result.success) {
		const zodErrors = result.error.flatten();
		throw new AppError('#ERR_VALIDATION_FAILED', 400, {
			title: 'Request validation failed',
			// Transform Zod field errors into a format suitable for additionalErrors
			errors: Object.entries(zodErrors.fieldErrors).map(([field, errors]) => ({
				field,
				errors: errors || []
			}))
		});
	}
};
