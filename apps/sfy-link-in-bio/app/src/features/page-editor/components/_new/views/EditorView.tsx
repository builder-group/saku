import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { NavPanel } from '../panels';
import { DesignView } from './DesignView';
import { PreviewView } from './PreviewView';
import { SettingsView } from './SettingsView';

export const EditorView: React.FC<TEditorViewProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<NavPanel editor={editor} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<View editor={editor} />
		</>
	);
};

interface TEditorViewProps {
	editor: TPageEditor;
}

const View: React.FC<TViewProps> = (props) => {
	const { editor } = props;

	const activeView = useFeatureState(editor.activeView);

	switch (activeView) {
		case 'layers':
			return <DesignView editor={editor} />;
		case 'preview':
			return <PreviewView editor={editor} />;
		case 'settings':
			return <SettingsView editor={editor} />;
		default:
			return null;
	}
};

interface TViewProps {
	editor: TPageEditor;
}
