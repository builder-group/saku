import React from 'react';
import { appConfig, crispConfig, logger } from '@/environment';
import { Crisp } from '@/lib/crisp/Crisp';

const CrispContext = React.createContext<Crisp | null>(null);

export const CrispProvider: React.FC<TCrispProviderProps> = (props) => {
	const { children, user } = props;
	const [crispInstance, setCrispInstance] = React.useState<Crisp | null>(null);

	// Initialize Crisp
	React.useEffect(() => {
		if (!appConfig.featureFlags.crisp) {
			logger.info('💬 Skipping Crisp initialization');
			return;
		}

		logger.info('💬 Initializing Crisp...', {
			websiteToken: crispConfig.websiteToken
		});

		// Create Crisp instance with configuration
		const [isCrispOk, crispError, crisp] = Crisp.create({
			websiteId: crispConfig.websiteToken,
			safeMode: appConfig.env === 'production'
		});
		if (!isCrispOk) {
			logger.error('💬 Failed to create Crisp instance:', crispError);
			return;
		}

		setCrispInstance(crisp);
		logger.info('💬 Initialized Crisp', { crisp });

		// Configure user data if available
		if (user != null) {
			crisp.configureUser({
				email: user.email,
				nickname: user.name,
				company: user.companyName
					? {
							name: user.companyName
						}
					: undefined,
				avatar: user.avatarUrl
			});
		}

		// Set up debug listeners only in non-production environments
		let unsubscribeDebugListeners: (() => void) | undefined;
		if (appConfig.env !== 'production') {
			const unsubscribeMessageListener = crisp.onMessageReceived((message) => {
				logger.info('💬 Message received', { message });
			});

			const unsubscribeMessageSentListener = crisp.onMessageSent((message) => {
				logger.info('💬 Message sent', { message });
			});

			const unsubscribeChatOpenedListener = crisp.onChatOpened(() => {
				logger.info('💬 Chat opened');
			});

			const unsubscribeChatClosedListener = crisp.onChatClosed(() => {
				logger.info('💬 Chat closed');
			});

			const unsubscribeAvailabilityListener = crisp.onWebsiteAvailabilityChanged((isAvailable) => {
				logger.info('💬 Availability changed', { isAvailable });
			});

			// Master unsubscribe function for all debug listeners
			unsubscribeDebugListeners = () => {
				unsubscribeMessageListener();
				unsubscribeMessageSentListener();
				unsubscribeChatOpenedListener();
				unsubscribeChatClosedListener();
				unsubscribeAvailabilityListener();
			};
		}

		// Set up auto-response when no operator is online
		const unsubscribeAutoResponse = crisp.onMessageSent((message) => {
			if (!message.is_me || crisp.isSupportOnline()) {
				return;
			}

			setTimeout(() => {
				crisp.showMessageAsOperator(
					'text',
					`Thanks for your message! Our team is currently offline, but we'll get back to you as soon as possible. You can also reach us via email at ${appConfig.support.email}.`
				);
			}, 1000);
		});

		return () => {
			unsubscribeDebugListeners?.();
			unsubscribeAutoResponse();
		};
	}, [user]);

	if (crispInstance == null) {
		return children;
	}

	return <CrispContext.Provider value={crispInstance}>{children}</CrispContext.Provider>;
};

interface TCrispProviderProps {
	children: React.ReactNode;
	user: {
		identifier: string;
		email?: string;
		name?: string;
		companyName?: string;
		avatarUrl?: string;
		additionalData?: Record<string, unknown>;
	};
}

export function useCrisp(): Crisp | null {
	return React.useContext(CrispContext);
}
