import { WelcomeEmail } from '@repo/transactional';
import { CreateEmailResponseSuccess, ErrorResponse } from 'resend';
import { Err, Ok, type TResult } from 'tuple-result';
import { appConfig, emailConfig, resend } from '@/environment';

export async function sendWelcomeEmail(
	props: TWelcomeEmailProps
): Promise<TResult<CreateEmailResponseSuccess, ErrorResponse>> {
	const {
		email,
		shopName,
		dashboardUrl,
		discordUrl = `${appConfig.client.appUrl}/s/discord?ref=welcome-email`
	} = props;

	const result = await resend.emails.send({
		from: emailConfig.from,
		to: props.email,
		subject: `Welcome to Saku 🌸 – let's get you started!`,
		react: (
			<WelcomeEmail
				email={email}
				shopName={shopName}
				dashboardUrl={dashboardUrl}
				discordUrl={discordUrl}
			/>
		)
	});
	if (result.error != null) {
		return Err(result.error);
	}

	return Ok(result.data as CreateEmailResponseSuccess);
}

interface TWelcomeEmailProps {
	email: string;
	shopName: string;
	dashboardUrl: string;
	discordUrl?: string;
}
