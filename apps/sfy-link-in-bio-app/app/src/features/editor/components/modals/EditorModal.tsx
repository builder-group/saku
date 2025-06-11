import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { Editor, TEditorProps } from '../Editor';

export const EditorModal: React.FC<TEditorModalProps> = (props) => {
	const { src, isOpenState, onShow, onHide, ...editorProps } = props;
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
			{src == null && <Editor {...editorProps} />}
		</Modal>
	);
};

interface TEditorModalProps extends TEditorProps {
	src?: string;
	isOpenState: TState<boolean, []>;
	onShow?: () => void;
	onHide?: () => void;
}

export function useEditorModal(config: TUseEditorModalConfig) {
	const { editor, src, onShow, onHide } = config;
	const isOpenState = React.useMemo(() => createState(false), []);

	const ModalCallback = React.useCallback(() => {
		return (
			<EditorModal
				src={src}
				isOpenState={isOpenState}
				onShow={onShow}
				onHide={onHide}
				editor={editor}
			/>
		);
	}, [isOpenState, onHide, onShow, editor, src]);

	return React.useMemo(
		() => ({
			Modal: ModalCallback,
			isOpenState
		}),
		[ModalCallback, isOpenState]
	);
}

interface TUseEditorModalConfig extends TEditorProps {
	src?: TEditorModalProps['src']; // https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route
	onShow?: TEditorModalProps['onShow'];
	onHide?: TEditorModalProps['onHide'];
}
