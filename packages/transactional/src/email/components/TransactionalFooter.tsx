import { Hr, Link, Tailwind, Text } from '@react-email/components';
import React from 'react';

export const TransactionalFooter: React.FC<TTransactionalFooterProps> = (props) => {
	const { email, notificationSettingsUrl, discordUrl, beforeContent = null } = props;

	return (
		<Tailwind>
			<Hr className="mx-0 my-6 w-full border border-neutral-200" />

			<>{beforeContent}</>

			<Text className="text-[12px] leading-6 text-neutral-500">
				This email was intended for <span className="text-black">{email}</span>. If you were not
				expecting this email, you can ignore this email. If you need help, reply to this email
				{discordUrl != null && (
					<>
						{' '}
						or join our{' '}
						<Link className="text-neutral-700 underline" href={discordUrl}>
							Community Discord
						</Link>
					</>
				)}
				.
			</Text>

			{notificationSettingsUrl != null && (
				<Text className="text-[12px] leading-6 text-neutral-500">
					Don't want to get these emails?{' '}
					<Link className="text-neutral-700 underline" href={notificationSettingsUrl}>
						Adjust your notification settings
					</Link>
				</Text>
			)}
		</Tailwind>
	);
};

interface TTransactionalFooterProps {
	email: string;
	notificationSettingsUrl?: string;
	discordUrl?: string;
	beforeContent?: React.ReactNode;
}
