import { BlockStack, Button, Card, Text } from '@shopify/polaris';
import { ChatIcon, EmailIcon } from '@shopify/polaris-icons';
import React from 'react';

export const GetInTouchCard: React.FC<TGetInTouchCardProps> = (props) => {
	const { version, discordUrl, email } = props;

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
							url={email}
							external
							target="_blank"
						>
							Send us an email
						</Button>
					)}
					{discordUrl != null && (
						<Button
							fullWidth
							variant="secondary"
							icon={ChatIcon}
							url={discordUrl}
							external
							target="_blank"
						>
							Join Discord
						</Button>
					)}
					{version != null && (
						<Text as="p" variant="bodyMd">
							Version {version}
						</Text>
					)}
				</BlockStack>
			</BlockStack>
		</Card>
	);
};

interface TGetInTouchCardProps {
	version?: string;
	discordUrl?: string;
	email?: string;
}
