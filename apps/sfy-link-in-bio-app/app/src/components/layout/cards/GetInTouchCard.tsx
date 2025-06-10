import { BlockStack, Button, Card, Text } from '@shopify/polaris';
import { ChatIcon, EmailIcon } from '@shopify/polaris-icons';
import React from 'react';

export const GetInTouchCard: React.FC = () => {
	return (
		<Card>
			<BlockStack gap="300">
				<Text as="h2" variant="headingMd">
					Get in touch
				</Text>
				<BlockStack gap="200">
					<Button
						fullWidth
						variant="secondary"
						icon={EmailIcon}
						url="mailto:support@saku.app"
						external
						target="_blank"
					>
						Send us an email
					</Button>
					<Button
						fullWidth
						variant="secondary"
						icon={ChatIcon}
						url="https://discord.gg/saku"
						external
						target="_blank"
					>
						Join Discord
					</Button>
				</BlockStack>
			</BlockStack>
		</Card>
	);
};
