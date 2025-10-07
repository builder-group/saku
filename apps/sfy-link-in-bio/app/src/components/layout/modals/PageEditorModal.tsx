import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { DeleteSiteConfirmationModal } from './DeleteSiteConfirmationModal';

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
			<DeleteSiteConfirmationModal siteId={siteId} />
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

export function usePageEditorModal(config: TUsePageEditorModalConfig) {
	const { siteId: initialSiteId, title: initialTitle, onShow, onHide } = config;
	const isOpenState = React.useMemo(() => createState(false), []);
	const [currentSiteMetadata, setCurrentSiteMetadata] = React.useState({
		siteId: initialSiteId,
		title: initialTitle
	});

	const openModal = React.useCallback(
		(siteId: string, title: string) => {
			setCurrentSiteMetadata({ siteId, title });
			isOpenState.set(true);
		},
		[isOpenState]
	);

	const ModalCallback = React.useCallback(() => {
		return (
			<PageEditorModal
				siteId={currentSiteMetadata.siteId}
				title={currentSiteMetadata.title}
				isOpenState={isOpenState}
				onShow={onShow}
				onHide={onHide}
			/>
		);
	}, [isOpenState, onHide, onShow, currentSiteMetadata]);

	return React.useMemo(
		() => ({
			Modal: ModalCallback,
			isOpenState,
			openModal
		}),
		[ModalCallback, isOpenState, openModal]
	);
}

interface TUsePageEditorModalConfig {
	siteId: TPageEditorModalProps['siteId'];
	title: TPageEditorModalProps['title'];
	onShow?: TPageEditorModalProps['onShow'];
	onHide?: TPageEditorModalProps['onHide'];
}
