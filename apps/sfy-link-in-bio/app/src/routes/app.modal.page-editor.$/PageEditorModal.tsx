import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';

export const PageEditorModal: React.FC<TPageEditorModalProps> = (props) => {
	const { siteId, title, isOpenState, onShow, onHide } = props;
	const isOpen = useFeatureState(isOpenState);

	const handleHide = React.useCallback(() => {
		isOpenState.set(false);
		onHide?.();
	}, [isOpenState, onHide]);

	return (
		<Modal
			id={`editor-modal-${siteId}`}
			src={`/app/modal/page-editor?siteId=${siteId}`} // https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route
			open={isOpen}
			onHide={handleHide}
			onShow={onShow}
			variant="max"
		>
			<TitleBar title={title} />
		</Modal>
	);
};

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
