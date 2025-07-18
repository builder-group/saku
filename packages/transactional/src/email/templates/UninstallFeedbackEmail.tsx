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

export const UninstallFeedbackEmail: TEmailFC<TUninstallFeedbackEmailProps> = (props) => {
	const { email, shopName, linkInBioPages, feedbackUrl, discordUrl, totalVisits } = props;

	return (
		<Html>
			<Head />
			<Preview>Thanks for trying Saku – here's what's changed</Preview>
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
							Thanks for giving Saku a try, {shopName}
						</Heading>

						<Text className="text-sm leading-6 text-black">
							We noticed you've uninstalled — no hard feelings at all! We truly appreciate the time
							you spent with us.
						</Text>

						{linkInBioPages && linkInBioPages.length > 0 && (
							<>
								<Text className="mt-6 text-sm leading-6 font-medium text-black">
									Here's what's changed:
								</Text>
								<Text className="text-sm leading-6 text-neutral-600">
									• Your Saku pages ({totalVisits?.toLocaleString() || '0'} total visits) are now
									offline:
								</Text>
								{linkInBioPages.map((page, index) => (
									<Text key={index} className="ml-6 text-sm leading-6 text-neutral-600">
										◦ {page}
									</Text>
								))}
								<Text className="mt-2 text-sm leading-6 text-neutral-600">
									• Your data will be automatically deleted in 48 hours
								</Text>
								<Text className="text-sm leading-6 text-neutral-600">
									• You can reinstall anytime before then to restore everything
								</Text>
							</>
						)}

						<Text className="mt-6 text-sm leading-6 text-black">
							We're always working to improve — and your feedback helps a lot.
							{'\n'}
							If you have 30 seconds, could you tell us why you uninstalled?
						</Text>

						<Section className="my-4">
							<Button
								className="rounded-lg bg-black px-6 py-3 text-center text-[14px] font-semibold text-white no-underline"
								href={feedbackUrl}
							>
								Quick Feedback (30 seconds)
							</Button>
						</Section>

						<Text className="text-sm leading-6 text-neutral-600">
							Or just reply to this email — we read every message and truly value your input.
						</Text>

						<Text className="mt-6 text-sm leading-6 text-black">
							Thanks again,
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

UninstallFeedbackEmail.PreviewProps = {
	email: 'merchant@example.com',
	shopName: 'Amazing Store',
	linkInBioPages: [
		'amazing-store.saku.so/summer-collection',
		'amazing-store.saku.so/new-arrivals',
		'amazing-store.saku.so/sale'
	],
	totalVisits: 2847,
	feedbackUrl: 'https://forms.saku.so/uninstall-feedback',
	discordUrl: 'https://discord.gg/saku'
};

export default UninstallFeedbackEmail;

interface TUninstallFeedbackEmailProps {
	email: string;
	shopName: string;
	linkInBioPages?: string[];
	totalVisits?: number;
	feedbackUrl: string;
	discordUrl?: string;
}
