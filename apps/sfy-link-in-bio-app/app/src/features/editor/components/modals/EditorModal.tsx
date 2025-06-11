import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';
import { Editor, TEditorProps } from '../Editor';

export const EditorModal: React.FC<TEditorModalProps> = (props) => {
	const { isOpenState, onShow, onHide, ...editorProps } = props;
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
		<Modal id="editor-modal" open={isOpen} onHide={handleHide} onShow={onShow} variant="max">
			<TitleBar title="default-bio">
				<button variant="primary" onClick={handleSave}>
					Save
				</button>
			</TitleBar>
			<Editor {...editorProps} />
		</Modal>
	);
};

interface TEditorModalProps extends TEditorProps {
	isOpenState: TState<boolean, []>;
	onShow?: () => void;
	onHide?: () => void;
}

export function useEditorModal(
	options: TUseEditorModalOptions = {},
	deps: React.DependencyList = []
) {
	const { onShow, onHide, ...editorProps } = options;
	const isOpenState = React.useMemo(() => createState(false), []);

	const ModalCallback = React.useCallback(() => {
		return (
			<EditorModal isOpenState={isOpenState} onShow={onShow} onHide={onHide} {...editorProps} />
		);
	}, [isOpenState, onHide, onShow, ...deps]);

	return React.useMemo(
		() => ({
			Modal: ModalCallback,
			isOpenState
		}),
		[ModalCallback, isOpenState]
	);
}

interface TUseEditorModalOptions extends Partial<TEditorProps> {
	onShow?: () => void;
	onHide?: () => void;
}
