import { MantleClient } from '@heymantle/client';
import { mantleConfig } from '@/environment';

export function getMantleClient(customerApiToken: string) {
	return new MantleClient({
		appId: mantleConfig.appId,
		customerApiToken
	});
}
