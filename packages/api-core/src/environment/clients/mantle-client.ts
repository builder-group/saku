import { MantleClient } from '@heymantle/client';
import { mantleConfig } from '../configs';

export const mantleClient = new MantleClient({
	appId: mantleConfig.appId,
	apiKey: mantleConfig.appApiKey
});
