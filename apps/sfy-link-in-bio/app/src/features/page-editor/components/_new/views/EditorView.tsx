import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { NavPanel } from '../panels';
import { DesignView } from './DesignView';
import { PreviewView } from './PreviewView';
import { SettingsView } from './SettingsView';

export const EditorView: React.FC<TEditorViewProps> = (props) => {
	const { editor, order = 1 } = props;

	return (
		<>
			<NavPanel editor={editor} order={order} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<View editor={editor} order={order + 1} />
		</>
	);
};

interface TEditorViewProps {
	editor: TPageEditor;
	order?: number;
}

const View: React.FC<TViewProps> = (props) => {
	const { editor, order } = props;

	const activeView = useFeatureState(editor.activeView);

	switch (activeView) {
		case 'layers':
			return <DesignView editor={editor} order={order} />;
		case 'preview':
			return <PreviewView editor={editor} order={order} />;
		case 'settings':
			return <SettingsView editor={editor} order={order} />;
		default:
			return null;
	}
};

interface TViewProps {
	editor: TPageEditor;
	order: number;
}
