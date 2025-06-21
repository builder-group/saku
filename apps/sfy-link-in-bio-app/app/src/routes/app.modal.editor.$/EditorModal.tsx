import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';

export const EditorModal: React.FC<TEditorModalProps> = (props) => {
	const { siteId, title, isOpenState, onShow, onHide } = props;
	const isOpen = useFeatureState(isOpenState);

	const handleHide = React.useCallback(() => {
		isOpenState.set(false);
		onHide?.();
	}, [isOpenState, onHide]);

	return (
		<Modal
			id={`editor-modal-${siteId}`}
			src={`/app/modal/editor?siteId=${siteId}`} // https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route
			open={isOpen}
			onHide={handleHide}
			onShow={onShow}
			variant="max"
		>
			<TitleBar title={title} />
		</Modal>
	);
};

interface TEditorModalProps {
	siteId: string;
	title: string;
	isOpenState: TState<boolean, []>;
	onShow?: () => void;
	onHide?: () => void;
}

export function useEditorModal(config: TUseEditorModalConfig) {
	const { siteId, title, onShow, onHide } = config;
	const isOpenState = React.useMemo(() => createState(false), []);

	const ModalCallback = React.useCallback(() => {
		return (
			<EditorModal
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

interface TUseEditorModalConfig {
	siteId: TEditorModalProps['siteId'];
	title: TEditorModalProps['title'];
	onShow?: TEditorModalProps['onShow'];
	onHide?: TEditorModalProps['onHide'];
}
