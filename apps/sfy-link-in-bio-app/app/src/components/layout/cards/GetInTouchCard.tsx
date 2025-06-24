import { Badge, BlockStack, Button, Card, Text } from '@shopify/polaris';
import { ChatIcon, EmailIcon } from '@shopify/polaris-icons';
import React from 'react';
import { coreApiClient } from '@/environment';

export const GetInTouchCard: React.FC<TGetInTouchCardProps> = (props) => {
	const { version, discordUrl, email } = props;
	const [healthStatus, setHealthStatus] = React.useState<'checking' | 'online' | 'offline'>(
		'checking'
	);

	React.useEffect(() => {
		(async () => {
			const result = await coreApiClient.get('/v1/health');
			if (result.isErr()) {
				setHealthStatus('offline');
				return;
			}

			setHealthStatus('online');
		})();
	}, []);

	const getHealthBadge = React.useCallback(() => {
		switch (healthStatus) {
			case 'online':
				return <Badge tone="success">Online</Badge>;
			case 'offline':
				return <Badge tone="critical">Offline</Badge>;
			case 'checking':
				return <Badge tone="info">Checking</Badge>;
		}
	}, [healthStatus]);

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
							Join Discord Community
						</Button>
					)}
					<BlockStack gap="100">
						{version != null && (
							<Text as="p" variant="bodyMd">
								App Version: {version}
							</Text>
						)}
						<Text as="p" variant="bodyMd">
							API Status: {getHealthBadge()}
						</Text>
					</BlockStack>
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
