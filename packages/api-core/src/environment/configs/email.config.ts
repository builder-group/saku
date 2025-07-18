import { validateEnvVar } from 'validatenv';
import { zValidator } from 'validation-adapters/zod';
import { z } from 'zod';

const domain = validateEnvVar({
	envKey: 'EMAIL_DOMAIN',
	validator: zValidator(z.string())
});

export const emailConfig = {
	domain,
	from: `Benno <benno@${domain}>`,
	resend: {
		apiKey: validateEnvVar({
			envKey: 'RESEND_API_KEY',
			validator: zValidator(z.string())
		})
	}
};
