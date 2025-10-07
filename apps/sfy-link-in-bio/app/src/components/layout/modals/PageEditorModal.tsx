import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { useDeleteSiteModal } from './DeleteSiteConfirmationModal';

export const PageEditorModal: React.FC<TPageEditorModalProps> & {
	modalId: (siteId: string) => string;
} = (props) => {
	const { cx } = props;

	const isOpen = useFeatureState(cx.isOpen);
	const { Modal: DeleteSiteConfirmationModal } = useDeleteSiteModal({ siteId: cx.siteId });

	// =========================================================================
	// UI
	// =========================================================================

	if (cx.siteId == null) {
		return;
	}

	return (
		<>
			<Modal
				id={PageEditorModal.modalId(cx.siteId)}
				src={`/app/modal/page-editor?siteId=${cx.siteId}`} // https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route
				open={isOpen}
				onHide={() => cx.isOpen.set(false)}
				onShow={() => cx.isOpen.set(true)}
				variant="max"
			>
				<TitleBar title={cx.title} />
			</Modal>

			{/* Shopify doesn't support modals inside modals and thus all modals required inside a Max Modal must be defined at the same level as the Max Modal. See: https://github.com/Shopify/shopify-app-bridge/issues/420 */}
			<DeleteSiteConfirmationModal />
		</>
	);
};
PageEditorModal.modalId = (siteId: string) => `editor-modal-${siteId}`;

interface TPageEditorModalProps {
	cx: TPageEditorModalCx;
}

export function usePageEditorModal(options: TUsePageEditorModalOptions = {}) {
	const { siteId: defaultSiteId, title: defaultTitle } = options;
	const cx = React.useMemo<TPageEditorModalCx>(() => {
		return {
			siteId: defaultSiteId,
			title: defaultTitle,
			isOpen: createState(false),
			open(siteId?: string, title?: string) {
				this.siteId = siteId;
				this.title = title;
				this.isOpen.set(true);
			}
		};
	}, [defaultSiteId, defaultTitle]);

	const ModalCallback = React.useCallback(() => {
		return <PageEditorModal cx={cx} />;
	}, [cx]);

	return React.useMemo(
		() => ({
			cx,
			Modal: ModalCallback
		}),
		[cx, ModalCallback]
	);
}

interface TUsePageEditorModalOptions {
	siteId?: string;
	title?: string;
}

interface TPageEditorModalCx {
	siteId?: string;
	title?: string;
	isOpen: TState<boolean, []>;
	open: (siteId: string, title: string) => void;
}
