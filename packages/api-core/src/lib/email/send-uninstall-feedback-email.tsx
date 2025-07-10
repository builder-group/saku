import { Err, Ok, TResult } from '@blgc/utils';
import { UninstallFeedbackEmail } from '@repo/transactional';
import { CreateEmailResponseSuccess, ErrorResponse } from 'resend';
import { appConfig, emailConfig, resend } from '@/environment';

export async function sendUninstallFeedbackEmail(
	props: TUninstallFeedbackEmailProps
): Promise<TResult<CreateEmailResponseSuccess, ErrorResponse>> {
	const {
		email,
		shopName,
		linkInBioPages,
		totalVisits,
		feedbackUrl,
		discordUrl = `${appConfig.client.appUrl}/s/discord?ref=uninstall-feedback-email`
	} = props;

	const result = await resend.emails.send({
		from: emailConfig.from,
		to: props.email,
		subject: `Thank you for trying Saku! 🌸`,
		react: (
			<UninstallFeedbackEmail
				email={email}
				shopName={shopName}
				linkInBioPages={linkInBioPages}
				totalVisits={totalVisits}
				feedbackUrl={feedbackUrl}
				discordUrl={discordUrl}
			/>
		)
	});
	if (result.error != null) {
		return Err(result.error);
	}

	return Ok(result.data as CreateEmailResponseSuccess);
}

interface TUninstallFeedbackEmailProps {
	email: string;
	shopName: string;
	linkInBioPages: string[];
	totalVisits: number;
	feedbackUrl: string;
	discordUrl?: string;
}
