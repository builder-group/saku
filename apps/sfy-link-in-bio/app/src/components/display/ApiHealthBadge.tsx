import { Badge } from '@shopify/polaris';
import React from 'react';
import { coreApiClient } from '@/environment';

export const ApiHealthBadge: React.FC = () => {
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

	switch (healthStatus) {
		case 'online':
			return <Badge tone="success">Operational</Badge>;
		case 'offline':
			return <Badge tone="critical">Unavailable</Badge>;
		case 'checking':
			return <Badge tone="info">Checking</Badge>;
	}
};
