import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components';
import { TransactionalFooter } from '../components';
import { TEmailFC } from '../types';

export const VerifyEmail: TEmailFC<TVerifyEmailProps> = (props) => {
	const { email, magicLink, otp, discordUrl } = props;

	return (
		<Html>
			<Head />
			<Preview>Verify your email address</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
						<Section className="mt-8">
							<Img
								src="https://raw.githubusercontent.com/-v1/refs/heads/develop/.github/assets/logo.png"
								width="32"
								height="32"
								alt="Saku's Logo"
							/>
						</Section>

						<Heading className="mx-0 my-7 p-0 text-xl font-medium text-black">
							Please confirm your email address
						</Heading>

						<Text className="text-sm leading-6 text-black">
							Click the button below to verify your email address:
						</Text>

						<Section className="my-8">
							<Button
								className="rounded-lg bg-black px-6 py-3 text-center text-[14px] font-semibold text-white no-underline"
								href={magicLink}
							>
								Verify Email
							</Button>
						</Section>

						<Text className="text-sm leading-6 text-neutral-500">
							Or enter this verification code:{' '}
							<span className="font-mono font-bold tracking-widest text-black">{otp}</span>
						</Text>

						<Text className="mt-4 text-sm leading-6 text-neutral-500">
							This verification link and code will expire in 5 minutes.
						</Text>

						<TransactionalFooter email={email} discordUrl={discordUrl} />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

VerifyEmail.PreviewProps = {
	email: 'benno@builder.group',
	magicLink: 'https://api.saku.so/magic-link',
	otp: '123456',
	discordUrl: 'https://discord.gg/saku'
};

export default VerifyEmail;

interface TVerifyEmailProps {
	email: string;
	magicLink: string;
	otp: string;
	discordUrl?: string;
}
