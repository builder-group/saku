import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { SettingsNavPanel, SettingsPlaceholderPanel } from '../panels';
import { SettingsAdvancedView } from './SettingsAdvancedView';
import { SettingsAssetsView } from './SettingsAssetsView';
import { SettingsDesignView } from './SettingsDesignView';
import { SettingsGeneralView } from './SettingsGeneralView';
import { SettingsIntegrationsView } from './SettingsIntegrationsView';
import { SettingsMetadataView } from './SettingsMetadataView';

const View: React.FC<TViewProps> = (props) => {
	const { editor } = props;

	const activeView = useFeatureState(editor.activeSettingsSection);

	switch (activeView) {
		case 'general':
			return <SettingsGeneralView editor={editor} />;
		case 'design':
			return <SettingsDesignView editor={editor} />;
		case 'metadata':
			return <SettingsMetadataView editor={editor} />;
		case 'assets':
			return <SettingsAssetsView editor={editor} />;
		case 'integrations':
			return <SettingsIntegrationsView editor={editor} />;
		case 'advanced':
			return <SettingsAdvancedView editor={editor} />;
		default:
			return <SettingsPlaceholderPanel />;
	}
};

interface TViewProps {
	editor: TPageEditor;
}

export const SettingsView: React.FC<TSettingsViewProps> = (props) => {
	const { editor } = props;
	const isMd = useEditorBreakpoint(editor, 'md');

	if (isMd) {
		return (
			<>
				<SettingsNavPanel editor={editor} />
				<ResizableHandle className="bg-neutral-200" />
				<View editor={editor} />
			</>
		);
	}

	return (
		<>
			<View editor={editor} />
			<ResizableHandle className="bg-neutral-200" withHandle />
			<SettingsNavPanel editor={editor} />
		</>
	);
};

interface TSettingsViewProps {
	editor: TPageEditor;
}
