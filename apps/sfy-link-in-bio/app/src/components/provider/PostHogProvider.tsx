import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import React from 'react';
import { appConfig, logger, posthogConfig } from '@/environment';

export const PosthogProvider: React.FC<TPosthogProviderProps> = (props) => {
	const { children } = props;

	const [hydrated, setHydrated] = React.useState(false);

	React.useEffect(() => {
		if (appConfig.env !== 'production') {
			logger.info('🦔 Skipping PostHog initialization in non-production environment');
			return;
		}

		logger.info('🦔 Initializing PostHog...', {
			key: posthogConfig.key,
			host: posthogConfig.host
		});

		posthog.init(posthogConfig.key, {
			api_host: posthogConfig.host,
			defaults: '2025-05-24',
			person_profiles: 'identified_only',
			capture_pageview: true, // TODO: Figure out whether we want to use the default page view tracking or our own (via usePosthogPageView() hook)
			session_recording: {
				maskAllInputs: false,
				maskInputOptions: {
					password: true
				}
			}
		});

		// Set global properties that will be sent with all events
		posthog.register({
			app_version: appConfig.version,
			app_name: '@repo/sfy-link-in-bio-app',
			app_environment: appConfig.env
		});

		setHydrated(true);
	}, []);

	if (!hydrated) {
		return <>{children}</>;
	}

	return <PHProvider client={posthog}>{children}</PHProvider>;
};

interface TPosthogProviderProps {
	children: React.ReactNode;
}
