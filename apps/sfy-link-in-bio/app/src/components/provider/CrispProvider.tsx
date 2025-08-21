import React from 'react';
import { appConfig, crispConfig, logger } from '@/environment';
import { Crisp } from '@/lib/crisp/Crisp';

const CrispContext = React.createContext<Crisp | null>(null);

export const CrispProvider: React.FC<TCrispProviderProps> = (props) => {
	const {
		children,
		user: {
			identifier: userIdentifier,
			email: userEmail,
			name: userName,
			companyName: userCompanyName,
			avatarUrl: userAvatarUrl
		}
	} = props;
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

		const unsubscribeCallbacks: (() => void)[] = [];

		const [isCrispOk, crispError, crisp] = Crisp.create({
			websiteId: crispConfig.websiteToken,
			safeMode: appConfig.env === 'production',
			onReady: (crisp) => {
				crisp.configureUser({
					email: userEmail,
					nickname: userName,
					company: userCompanyName
						? {
								name: userCompanyName
							}
						: undefined,
					avatar: userAvatarUrl
				});

				// Set up auto-response when no operator is online
				// Check if we already set up callbacks to prevent duplicates across iframes
				// because Shopify modals create iframes, so we have two Crisp instances in the same browser tab
				const hasSetUpCallbacks = crisp.getSessionData<boolean>('hasSetUpCallbacks');
				if (hasSetUpCallbacks) {
					return;
				}

				crisp.setSessionData('hasSetUpCallbacks', true);

				// Set up debug listeners only in non-production environments
				if (appConfig.env !== 'production') {
					unsubscribeCallbacks.push(
						crisp.onMessageReceived((message) => {
							logger.info('💬 Message received', { message });
						}),
						crisp.onMessageSent((message) => {
							logger.info('💬 Message sent', { message });
						}),
						crisp.onChatOpened(() => {
							logger.info('💬 Chat opened');
						}),
						crisp.onChatClosed(() => {
							logger.info('💬 Chat closed');
						}),
						crisp.onWebsiteAvailabilityChanged((isAvailable) => {
							logger.info('💬 Availability changed', { isAvailable });
						})
					);
				}

				// Set up auto-response when no operator is online
				unsubscribeCallbacks.push(
					crisp.onMessageSent((message) => {
						if (!message.is_me || crisp.isSupportOnline()) {
							return;
						}

						// Check when we last sent the offline message to not spam the user
						const lastOfflineMessage = crisp.getSessionData<number>('lastOfflineMessageTime');
						const now = Date.now();
						const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
						if (lastOfflineMessage != null && now - lastOfflineMessage < fiveMinutes) {
							return; // Too soon to send another offline message
						}

						// Store the current time when we send the offline message
						crisp.setSessionData('lastOfflineMessageTime', now);

						setTimeout(() => {
							crisp.showMessageAsOperator(
								'text',
								`Thanks for your message! Our team is currently offline, but we'll get back to you as soon as possible. You can also reach us via email at ${appConfig.support.email}.`
							);
						}, 1000);
					})
				);
			}
		});
		if (!isCrispOk) {
			logger.error('💬 Failed to create Crisp instance:', crispError);
			return;
		}

		setCrispInstance(crisp);
		logger.info('💬 Initialized Crisp', { crisp });

		return () => {
			if (unsubscribeCallbacks.length > 0) {
				unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
				crisp.setSessionData('hasSetUpCallbacks', false);
			}
		};
	}, [userIdentifier, userEmail, userName, userCompanyName, userAvatarUrl]);

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
