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

export const WelcomeEmail: TEmailFC<TWelcomeEmailProps> = (props) => {
	const { email, shopName, dashboardUrl, discordUrl } = props;

	return (
		<Html>
			<Head />
			<Preview>Welcome to Saku – let's get you started!</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
						<Section className="mt-8">
							<Img
								src="https://raw.githubusercontent.com/builder-group/saku-v1/refs/heads/develop/.github/assets/logo.png"
								width="32"
								height="32"
								alt="Saku's Logo"
							/>
						</Section>

						<Heading className="mx-0 my-7 p-0 text-xl font-medium text-black">
							Hey {shopName}, Benno here :)
						</Heading>

						<Text className="text-sm leading-6 text-black">Thank you for signing up for Saku!</Text>

						<Text className="mt-4 text-sm leading-6 text-black">
							I'm excited to see what you'll build with your link-in-bio pages. Whether it's
							showcasing your products, sharing your story, or connecting with your customers – Saku
							is here to help you create something amazing.
						</Text>

						<Text className="mt-4 text-sm leading-6 text-black">
							Let me know if you need any help navigating through our platform or features. I read
							every message and love hearing from our users.
						</Text>

						<Section className="my-6">
							<Button
								className="rounded-lg bg-black px-6 py-3 text-center text-[14px] font-semibold text-white no-underline"
								href={dashboardUrl}
							>
								Get Started
							</Button>
						</Section>

						<Text className="text-sm leading-6 text-black">
							Best,
							<br />
							Benno & the Saku Team 🌸
						</Text>

						<TransactionalFooter email={email} discordUrl={discordUrl} />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

WelcomeEmail.PreviewProps = {
	email: 'merchant@example.com',
	shopName: 'Amazing Store',
	dashboardUrl: 'https://app.saku.so/dashboard',
	discordUrl: 'https://discord.gg/saku'
};

export default WelcomeEmail;

interface TWelcomeEmailProps {
	email: string;
	shopName: string;
	dashboardUrl: string;
	discordUrl?: string;
}
