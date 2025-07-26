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
			return <s-badge tone="success">Operational</s-badge>;
		case 'offline':
			return <s-badge tone="critical">Unavailable</s-badge>;
		case 'checking':
			return <s-badge tone="info">Checking</s-badge>;
	}
};
