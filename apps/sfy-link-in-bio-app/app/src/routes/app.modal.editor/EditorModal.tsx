import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { useFeatureState } from 'feature-react/state';
import { createState, TState } from 'feature-state';
import React from 'react';

export const EditorModal: React.FC<TEditorModalProps> = (props) => {
	const { site, isOpenState, onShow, onHide } = props;
	const isOpen = useFeatureState(isOpenState);

	const handleHide = React.useCallback(() => {
		isOpenState.set(false);
		onHide?.();
	}, [isOpenState, onHide]);

	return (
		<Modal
			id={`editor-modal-${site.id}`}
			src={`/app/modal/editor?siteId=${site.id}`} // https://shopify.dev/docs/api/app-bridge/using-modals-in-your-app#modals-with-a-route
			open={isOpen}
			onHide={handleHide}
			onShow={onShow}
			variant="max"
		>
			<TitleBar title={site.displayName} />
		</Modal>
	);
};

interface TEditorModalProps {
	site: {
		id: string;
		displayName: string;
	};
	isOpenState: TState<boolean, []>;
	onShow?: () => void;
	onHide?: () => void;
}

export function useEditorModal(config: TUseEditorModalConfig, deps: React.DependencyList = []) {
	const { site, onShow, onHide } = config;
	const isOpenState = React.useMemo(() => createState(false), []);

	const ModalCallback = React.useCallback(() => {
		return <EditorModal site={site} isOpenState={isOpenState} onShow={onShow} onHide={onHide} />;
	}, [isOpenState, onHide, onShow, ...deps]);

	return React.useMemo(
		() => ({
			Modal: ModalCallback,
			isOpenState
		}),
		[ModalCallback, isOpenState]
	);
}

interface TUseEditorModalConfig {
	site: TEditorModalProps['site'];
	onShow?: TEditorModalProps['onShow'];
	onHide?: TEditorModalProps['onHide'];
}
