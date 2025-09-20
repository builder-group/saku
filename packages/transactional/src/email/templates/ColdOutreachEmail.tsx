import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components';
import React from 'react';
import { TEmailFC } from '../types';

export const ColdOutreachEmail: TEmailFC<TColdOutreachEmailProps> = (props) => {
	const { name, handle, videoId } = props;

	const videoUrl = React.useMemo(() => `https://cap.link/${videoId}`, [videoId]);
	const thumbnailUrl = React.useMemo(
		() => `https://cap.so/api/video/og?videoId=${videoId}`,
		[videoId]
	);
	const instagramUrl = React.useMemo(() => `https://instagram.com/${handle}`, [handle]);

	return (
		<Html>
			<Head />
			<Preview>Quick update about your LinkPop page</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
						<Heading className="mx-0 my-6 p-0 text-sm font-medium text-black">Hi {name},</Heading>

						<Text className="text-sm leading-6 text-black">
							I noticed you're still using LinkPop in your Instagram bio (
							<Link href={instagramUrl} className="text-blue-600 underline">
								@{handle}
							</Link>
							) — Shopify recently shut it down.
						</Text>

						<Text className="mt-6 text-sm leading-6 text-black">
							I made a quick 30-second video showing what that means for your LinkPop page:
						</Text>

						<Section className="my-6">
							<Link href={videoUrl}>
								<Img
									src={thumbnailUrl}
									alt="Watch video: What LinkPop shutdown means for your page"
									width="100%"
									height="auto"
									className="rounded-lg border border-neutral-200"
								/>
							</Link>
						</Section>

						<Text className="text-sm leading-6 text-black">
							If you want to learn more, just reply 👍 — I explain more in the video.
						</Text>

						<Text className="mt-6 text-sm leading-6 text-black">
							Best,
							<br />
							Benno
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

ColdOutreachEmail.PreviewProps = {
	name: 'Kristi',
	handle: 'kristi.brocato',
	videoId: 'em9wkqys0ghk8ma'
};

export default ColdOutreachEmail;

interface TColdOutreachEmailProps {
	name: string;
	handle: string;
	videoId: string;
}
