import { Spinner } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { MobileNavPanel, NavPanel } from '../panels';
import { DesignView } from './DesignView';
import { PreviewView } from './PreviewView';
import { SettingsView } from './SettingsView';

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

export const EditorView: React.FC<TEditorViewProps> = (props) => {
	const { editor } = props;

	const isReady = useFeatureState(editor.isReady);
	const isMd = useEditorBreakpoint(editor, 'md');

	// Show loading spinner while not ready to hide messed up panel layout
	if (!isReady) {
		return (
			<div className="flex h-full w-full items-center justify-center bg-white">
				<Spinner accessibilityLabel="Loading editor..." size="small" />
			</div>
		);
	}

	if (isMd) {
		return (
			<>
				<NavPanel editor={editor} />
				<ResizableHandle className="bg-neutral-200" />
				<View editor={editor} />
			</>
		);
	}

	return (
		<>
			<View editor={editor} />
			<ResizableHandle className="bg-neutral-200" />
			<MobileNavPanel editor={editor} />
		</>
	);
};

interface TEditorViewProps {
	editor: TPageEditor;
}
