const domain = process.env['EMAIL_DOMAIN']!;

export const appConfig = {
	env: process.env['NODE_ENV']!,
	email: {
		domain,
		from: `Benno <benno@${domain}>`
	},
	resend: {
		apiKey: process.env['RESEND_API_KEY']!
	}
};
