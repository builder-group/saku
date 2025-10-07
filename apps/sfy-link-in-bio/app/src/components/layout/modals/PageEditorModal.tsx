import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { RemoteDeleteSiteConfirmationModal } from './RemoteDeleteSiteConfirmationModal';

export const PageEditorModal: React.FC<TPageEditorModalProps> & {
	modalId: (siteId: string) => string;
} = (props) => {
	const { siteId, title, isOpenState, onShow, onHide } = props;
	const isOpen = useFeatureState(isOpenState);

	const handleHide = React.useCallback(() => {
		isOpenState.set(false);
		onHide?.();
	}, [isOpenState, onHide]);

	return (
		<>
			<Modal
				id={PageEditorModal.modalId(siteId)}
				src={`/app/modal/page-editor?siteId=${siteId}`} // https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route
				open={isOpen}
				onHide={handleHide}
				onShow={onShow}
				variant="max"
			>
				<TitleBar title={title} />
			</Modal>

			{/* Shopify doesn't support modals inside modals and thus all modals required inside a Max Modal must be defined at the same level as the Max Modal. See: https://github.com/Shopify/shopify-app-bridge/issues/420 */}
			<RemoteDeleteSiteConfirmationModal siteId={siteId} />
		</>
	);
};
PageEditorModal.modalId = (siteId: string) => `editor-modal-${siteId}`;

interface TPageEditorModalProps {
	siteId: string;
	title: string;
	isOpenState: TState<boolean, []>;
	onShow?: () => void;
	onHide?: () => void;
}

export function usePageEditorModal(options: TUsePageEditorModalOptions = {}) {
	const { onShow, onHide } = options;
	const isOpenState = React.useMemo(() => createState(false), []);
	const [modalProps, setModalProps] = React.useState<{ siteId: string; title: string } | null>(
		null
	);

	const openModal = React.useCallback(
		(siteId: string, title: string) => {
			setModalProps({ siteId, title });
			isOpenState.set(true);
		},
		[isOpenState]
	);

	const ModalCallback = React.useCallback(() => {
		if (modalProps == null) {
			return;
		}

		return (
			<PageEditorModal {...modalProps} isOpenState={isOpenState} onShow={onShow} onHide={onHide} />
		);
	}, [isOpenState, onHide, onShow, modalProps]);

	return React.useMemo(
		() => ({
			Modal: ModalCallback,
			isOpenState,
			openModal
		}),
		[ModalCallback, isOpenState, openModal]
	);
}

interface TUsePageEditorModalOptions {
	onShow?: TPageEditorModalProps['onShow'];
	onHide?: TPageEditorModalProps['onHide'];
}
