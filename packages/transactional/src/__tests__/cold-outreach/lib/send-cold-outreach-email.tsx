import { CreateEmailResponseSuccess, ErrorResponse } from 'resend';
import { Err, Ok, type TResult } from 'tuple-result';
import { ColdOutreachEmail } from '../../../index';
import { appConfig, resend } from '../environment';

export async function sendColdOutreachEmail(
	props: TColdOutreachEmailProps
): Promise<TResult<CreateEmailResponseSuccess, ErrorResponse>> {
	const { email, name, handle, videoId } = props;

	const result = await resend.emails.send({
		from: appConfig.email.from,
		to: email,
		subject: `Your Instagram bio page stopped working (@${handle})`,
		react: <ColdOutreachEmail name={name} handle={handle} videoId={videoId} />
	});
	if (result.error != null) {
		return Err(result.error);
	}

	return Ok(result.data as CreateEmailResponseSuccess);
}

interface TColdOutreachEmailProps {
	email: string;
	name: string;
	handle: string;
	videoId: string;
}
