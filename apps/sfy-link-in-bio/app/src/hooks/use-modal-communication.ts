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
	const { onParentMessage } = options;

	const sendToParent = React.useCallback(
		(payload: GModalToParentPayload) => {
			const message: TModalToParentMessage<GModalToParentPayload> = {
				type: 'modal-to-parent',
				payload,
				timestamp: Date.now(),
				modalId
			};

			// logger.info('[useModalCommunication] sending message to parent', { message });
			window.postMessage(message, window.location.origin);
		},
		[modalId]
	);

	React.useEffect(() => {
		const handleMessage = (event: MessageEvent<TParentToModalMessage<GParentToModalPayload>>) => {
			// logger.info('[useModalCommunication] received message from parent', { event });
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
	}, [modalId, onParentMessage]);

	return { sendToParent };
}

interface TModalCommunicationOptions<GParentToModalPayload> {
	onParentMessage?: (payload: GParentToModalPayload) => void;
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
	const { onModalMessage, inMaxModal = false } = options;

	const sendToModal = React.useCallback(
		(payload: GParentToModalPayload) => {
			const message: TParentToModalMessage<GParentToModalPayload> = {
				type: 'parent-to-modal',
				payload,
				timestamp: Date.now(),
				modalId
			};

			// logger.info('[useParentCommunication] sending message to modal', { message });
			if (inMaxModal) {
				// Note: Use window.opener because Shopify doesn't support modals inside modals and thus all modals are siblings, not children
				// https://github.com/Shopify/shopify-app-bridge/issues/420
				window.opener.postMessage(message, window.location.origin);
			} else {
				window.postMessage(message, window.location.origin);
			}
		},
		[modalId, inMaxModal]
	);

	React.useEffect(() => {
		const handleMessage = (event: MessageEvent<TModalToParentMessage<GModalToParentPayload>>) => {
			// logger.info('[useParentCommunication] received message from modal', { event });
			if (
				event.origin !== window.location.origin ||
				event.data?.type !== 'modal-to-parent' ||
				event.data.modalId !== modalId
			) {
				return;
			}

			onModalMessage?.(event.data.payload);
		};

		if (inMaxModal) {
			// Note: Use window.opener because Shopify doesn't support modals inside modals and thus all modals are siblings, not children
			// https://github.com/Shopify/shopify-app-bridge/issues/420
			window.opener.addEventListener('message', handleMessage);
			return () => {
				window.opener.removeEventListener('message', handleMessage);
			};
		} else {
			window.addEventListener('message', handleMessage);
			return () => {
				window.removeEventListener('message', handleMessage);
			};
		}
	}, [modalId, onModalMessage, inMaxModal]);

	return { sendToModal };
}

interface TParentCommunicationOptions<GModalToParentPayload> {
	onModalMessage?: (payload: GModalToParentPayload) => void;
	inMaxModal?: boolean;
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
