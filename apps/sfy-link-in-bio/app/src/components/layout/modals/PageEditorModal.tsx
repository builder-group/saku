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

			{/* All modals shown inside a Max Modal must be defined at the same level as the Max Modal, not nested within other modals. Shopify App Bridge doesn't support opening a modal from within another modal. See: https://github.com/Shopify/shopify-app-bridge/issues/420 */}
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
	const { siteId, title, onShow, onHide } = config;
	const isOpenState = React.useMemo(() => createState(false), []);

	const ModalCallback = React.useCallback(() => {
		return (
			<PageEditorModal
				siteId={siteId}
				title={title}
				isOpenState={isOpenState}
				onShow={onShow}
				onHide={onHide}
			/>
		);
	}, [isOpenState, onHide, onShow, siteId, title]);

	return React.useMemo(
		() => ({
			Modal: ModalCallback,
			isOpenState
		}),
		[ModalCallback, isOpenState]
	);
}

interface TUsePageEditorModalConfig {
	siteId: TPageEditorModalProps['siteId'];
	title: TPageEditorModalProps['title'];
	onShow?: TPageEditorModalProps['onShow'];
	onHide?: TPageEditorModalProps['onHide'];
}
