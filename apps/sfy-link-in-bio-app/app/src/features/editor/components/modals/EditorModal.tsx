import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';

export const EditorModal: React.FC<TEditorModalProps> = (props) => {
	const { src, isOpenState, onShow, onHide } = props;
	const isOpen = useFeatureState(isOpenState);

	const handleSave = React.useCallback(() => {
		isOpenState.set(false);
		onHide?.();
	}, [isOpenState, onHide]);

	const handleHide = React.useCallback(() => {
		isOpenState.set(false);
		onHide?.();
	}, [isOpenState, onHide]);

	return (
		<Modal
			id="editor-modal"
			src={src}
			open={isOpen}
			onHide={handleHide}
			onShow={onShow}
			variant="max"
		>
			<TitleBar title="default-bio">
				<button variant="primary" onClick={handleSave}>
					Save
				</button>
			</TitleBar>
		</Modal>
	);
};

interface TEditorModalProps {
	src?: string;
	isOpenState: TState<boolean, []>;
	onShow?: () => void;
	onHide?: () => void;
}

export function useEditorModal(config: TUseEditorModalConfig) {
	const { src, onShow, onHide } = config;
	const isOpenState = React.useMemo(() => createState(false), []);

	const ModalCallback = React.useCallback(() => {
		return <EditorModal src={src} isOpenState={isOpenState} onShow={onShow} onHide={onHide} />;
	}, [isOpenState, onHide, onShow, src]);

	return React.useMemo(
		() => ({
			Modal: ModalCallback,
			isOpenState
		}),
		[ModalCallback, isOpenState]
	);
}

interface TUseEditorModalConfig {
	src?: TEditorModalProps['src']; // https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route
	onShow?: TEditorModalProps['onShow'];
	onHide?: TEditorModalProps['onHide'];
}
