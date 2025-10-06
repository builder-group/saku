import React from 'react';

/**
 * Hook for modal components to communicate with parent window
 */
export function useModalCommunication<
	GModalToParentPayload = unknown,
	GParentToModalPayload = unknown
>(
	modalId: string,
	options: TModalCommunicationOptions<GParentToModalPayload> = {}
): TModalCommunicationReturn<GModalToParentPayload> {
	const { onParentMessage, communicationMethod = 'postMessage' } = options;

	const sendToParent = React.useCallback(
		(payload: GModalToParentPayload) => {
			const message: TModalToParentMessage<GModalToParentPayload> = {
				type: 'modal-to-parent',
				payload,
				timestamp: Date.now(),
				modalId
			};

			switch (communicationMethod) {
				// Use localStorage for cross-iframe communication
				// Use this when modal and parent are in different iframes
				case 'localStorage': {
					const storageKey = `modal-message-${modalId}`;
					localStorage.setItem(storageKey, JSON.stringify(message));
					break;
				}

				// Use postMessage for same-window communication
				// Use this when modal and parent are in the same window/iframe
				case 'postMessage': {
					window.postMessage(message, window.location.origin);
					break;
				}
			}
		},
		[modalId, communicationMethod]
	);

	React.useEffect(() => {
		switch (communicationMethod) {
			// Listen for localStorage events (cross-iframe communication)
			case 'localStorage': {
				const handleStorageEvent = (event: StorageEvent) => {
					if (event.key === `parent-message-${modalId}` && event.newValue != null) {
						try {
							const message = JSON.parse(event.newValue);
							if (message.type === 'parent-to-modal' && message.modalId === modalId) {
								onParentMessage?.(message.payload);
							}
						} catch {
							// Ignore parsing errors
						}
					}
				};

				window.addEventListener('storage', handleStorageEvent);
				return () => window.removeEventListener('storage', handleStorageEvent);
			}

			// Listen for postMessage events (same-window communication)
			case 'postMessage': {
				const handleMessage = (
					event: MessageEvent<TParentToModalMessage<GParentToModalPayload>>
				) => {
					if (
						event.origin !== window.location.origin ||
						event.data?.type !== 'parent-to-modal' ||
						event.data.modalId !== modalId
					) {
						return;
					}

					onParentMessage?.(event.data.payload);
				};

				window.addEventListener('message', handleMessage);
				return () => {
					window.removeEventListener('message', handleMessage);
				};
			}
		}
	}, [modalId, onParentMessage, communicationMethod]);

	return { sendToParent };
}

interface TModalCommunicationOptions<GParentToModalPayload> {
	onParentMessage?: (payload: GParentToModalPayload) => void;
	/**
	 * Communication method to use for modal-parent communication.
	 *
	 * - 'postMessage' (default): Use when modal and parent are in the same window/iframe
	 * - 'localStorage': **Required** when modal and parent are in different iframes (but still same domain)
	 *
	 * e.g. 'localStorage' is required when:
	 * - Page Editor Modal (iframe) → Delete Confirmation Modal (main app frame)
	 * - Shopify App Bridge doesn't allow nested modals, so confirmation modals
	 *   must be rendered at the same level as the page editor modal, not inside it
	 */
	communicationMethod?: TModalCommunicationMethod;
}

interface TModalCommunicationReturn<GModalToParentPayload> {
	sendToParent: (payload: GModalToParentPayload) => void;
}

/**
 * Hook for parent components to communicate with modals
 */
export function useParentCommunication<
	GModalToParentPayload = unknown,
	GParentToModalPayload = unknown
>(
	modalId: string,
	options: TParentCommunicationOptions<GModalToParentPayload> = {}
): TParentCommunicationReturn<GParentToModalPayload> {
	const { onModalMessage, communicationMethod = 'postMessage' } = options;

	const sendToModal = React.useCallback(
		(payload: GParentToModalPayload) => {
			const message: TParentToModalMessage<GParentToModalPayload> = {
				type: 'parent-to-modal',
				payload,
				timestamp: Date.now(),
				modalId
			};

			switch (communicationMethod) {
				// Use localStorage for cross-iframe communication
				// Use this when modal and parent are in different iframes
				case 'localStorage': {
					const storageKey = `parent-message-${modalId}`;
					localStorage.setItem(storageKey, JSON.stringify(message));
					break;
				}

				// Use postMessage for same-window communication
				// Use this when modal and parent are in the same window/iframe
				case 'postMessage': {
					window.postMessage(message, window.location.origin);
					break;
				}
			}
		},
		[modalId, communicationMethod]
	);

	React.useEffect(() => {
		switch (communicationMethod) {
			// Listen for localStorage events (cross-iframe communication)
			case 'localStorage': {
				const handleStorageEvent = (event: StorageEvent) => {
					if (event.key === `modal-message-${modalId}` && event.newValue != null) {
						try {
							const message = JSON.parse(event.newValue);
							if (message.type === 'modal-to-parent' && message.modalId === modalId) {
								onModalMessage?.(message.payload);
							}
						} catch {
							// Ignore parsing errors
						}
					}
				};

				window.addEventListener('storage', handleStorageEvent);
				return () => window.removeEventListener('storage', handleStorageEvent);
			}

			// Listen for postMessage events (same-window communication)
			case 'postMessage': {
				const handleMessage = (
					event: MessageEvent<TModalToParentMessage<GModalToParentPayload>>
				) => {
					if (
						event.origin !== window.location.origin ||
						event.data?.type !== 'modal-to-parent' ||
						event.data.modalId !== modalId
					) {
						return;
					}

					onModalMessage?.(event.data.payload);
				};

				window.addEventListener('message', handleMessage);
				return () => {
					window.removeEventListener('message', handleMessage);
				};
			}
		}
	}, [modalId, onModalMessage, communicationMethod]);

	return { sendToModal };
}

interface TParentCommunicationOptions<GModalToParentPayload> {
	onModalMessage?: (payload: GModalToParentPayload) => void;
	/**
	 * Communication method to use for modal-parent communication.
	 *
	 * - 'postMessage' (default): Use when modal and parent are in the same window/iframe
	 * - 'localStorage': **Required** when modal and parent are in different iframes (but still same domain)
	 *
	 * e.g. 'localStorage' is required when:
	 * - Page Editor Modal (iframe) → Delete Confirmation Modal (main app frame)
	 * - Shopify App Bridge doesn't allow nested modals, so confirmation modals
	 *   must be rendered at the same level as the page editor modal, not inside it
	 */
	communicationMethod?: TModalCommunicationMethod;
}

interface TParentCommunicationReturn<GParentToModalPayload> {
	sendToModal: (payload: GParentToModalPayload) => void;
}

interface TBaseMessage {
	type: string;
	payload: unknown;
	timestamp: number;
	modalId: string;
}

interface TModalToParentMessage<GModalToParentPayload = unknown> extends TBaseMessage {
	type: 'modal-to-parent';
	payload: GModalToParentPayload;
}

interface TParentToModalMessage<GParentToModalPayload = unknown> extends TBaseMessage {
	type: 'parent-to-modal';
	payload: GParentToModalPayload;
}

export type TModalCommunicationMethod = 'postMessage' | 'localStorage';
