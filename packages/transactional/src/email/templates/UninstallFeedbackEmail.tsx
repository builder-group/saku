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
			<Preview>Thank you for trying Saku - quick feedback?</Preview>
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
							Thank you for trying Saku, {shopName}
						</Heading>

						<Text className="text-sm leading-6 text-black">
							We noticed you uninstalled Saku — no hard feelings! Thank you for giving us a try.
						</Text>

						<Text className="text-sm leading-6 text-black">
							Would you mind sharing why you uninstalled? (pricing, features, setup, etc.) Your
							feedback helps us improve for other merchants.
						</Text>

						<Section className="my-6">
							<Button
								className="rounded-lg bg-black px-6 py-3 text-center text-[14px] font-semibold text-white no-underline"
								href={feedbackUrl}
							>
								Quick Feedback (30 seconds)
							</Button>
						</Section>

						<Text className="text-sm leading-6 text-neutral-600">
							Prefer to reply? Just hit reply — we read every message.
						</Text>

						{linkInBioPages && linkInBioPages.length > 0 && (
							<>
								<Text className="text-sm leading-6 text-black">
									During your time with Saku, your pages received{' '}
									{totalVisits?.toLocaleString() || '[visits]'} visits. They're now offline:
								</Text>
								{linkInBioPages.map((page, index) => (
									<Text key={index} className="text-sm leading-6 text-neutral-600">
										• {page}
									</Text>
								))}
							</>
						)}

						<Text className="text-sm leading-6 text-black">
							All data will be permanently deleted in 2 days unless you reinstall. If you do
							reinstall before then, everything will be restored.
						</Text>

						<Text className="text-sm leading-6 text-black">
							Cheers,
							<br />
							The Saku Team 🌸
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
