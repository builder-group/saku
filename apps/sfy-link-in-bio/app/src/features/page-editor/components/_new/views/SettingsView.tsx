import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { SettingsNavPanel } from '../panels';
import { SettingsAssetsView } from './SettingsAssetsView';
import { SettingsDesignView } from './SettingsDesignView';
import { SettingsIntegrationsView } from './SettingsIntegrationsView';
import { SettingsMetadataView } from './SettingsMetadataView';

export const SettingsView: React.FC<TSettingsViewProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<SettingsNavPanel editor={editor} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<View editor={editor} />
		</>
	);
};

interface TSettingsViewProps {
	editor: TPageEditor;
}

const View: React.FC<TViewProps> = (props) => {
	const { editor } = props;

	const activeView = useFeatureState(editor.activeSettingsSection);

	switch (activeView) {
		case 'design':
			return <SettingsDesignView editor={editor} />;
		case 'metadata':
			return <SettingsMetadataView editor={editor} />;
		case 'assets':
			return <SettingsAssetsView editor={editor} />;
		case 'integrations':
			return <SettingsIntegrationsView editor={editor} />;
		default:
			return null;
	}
};

interface TViewProps {
	editor: TPageEditor;
}
