import { BlockStack, Button, Card, Text } from '@shopify/polaris';
import { ChatIcon, EmailIcon } from '@shopify/polaris-icons';
import React from 'react';

export const GetInTouchCard: React.FC<TGetInTouchCardProps> = (props) => {
	const { discordUrl, email } = props;

	return (
		<Card>
			<BlockStack gap="300">
				<Text as="h2" variant="headingMd">
					Get in touch
				</Text>
				<BlockStack gap="200">
					{email != null && (
						<Button
							fullWidth
							variant="secondary"
							icon={EmailIcon}
							url={`mailto:${email}`}
							target="_blank"
						>
							Send us an email
						</Button>
					)}
					{discordUrl != null && (
						<Button fullWidth variant="secondary" icon={ChatIcon} url={discordUrl} target="_blank">
							Join Discord community
						</Button>
					)}
				</BlockStack>
			</BlockStack>
		</Card>
	);
};

interface TGetInTouchCardProps {
	discordUrl?: string;
	email?: string;
}
