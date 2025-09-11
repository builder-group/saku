import { useFeatureState } from 'feature-react';
import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { SettingsNavPanel, SettingsPlaceholderPanel } from '../panels';
import { SettingsAssetsView } from './SettingsAssetsView';
import { SettingsDesignView } from './SettingsDesignView';
import { SettingsIntegrationsView } from './SettingsIntegrationsView';
import { SettingsMetadataView } from './SettingsMetadataView';

export const SettingsView: React.FC<TSettingsViewProps> = (props) => {
	const { editor, order } = props;
	const isMd = useEditorBreakpoint(editor, 'md');

	if (isMd) {
		return (
			<>
				<SettingsNavPanel editor={editor} order={order} />
				<ResizableHandle className="bg-neutral-200" />
				<View editor={editor} order={order + 1} />
			</>
		);
	}

	return (
		<>
			<View editor={editor} order={order} />
			<ResizableHandle className="bg-neutral-200" withHandle />
			<SettingsNavPanel editor={editor} order={order + 1} />
		</>
	);
};

interface TSettingsViewProps {
	editor: TPageEditor;
	order: number;
}

const View: React.FC<TViewProps> = (props) => {
	const { editor, order } = props;

	const activeView = useFeatureState(editor.activeSettingsSection);

	switch (activeView) {
		case 'design':
			return <SettingsDesignView editor={editor} order={order} />;
		case 'metadata':
			return <SettingsMetadataView editor={editor} order={order} />;
		case 'assets':
			return <SettingsAssetsView editor={editor} order={order} />;
		case 'integrations':
			return <SettingsIntegrationsView editor={editor} order={order} />;
		default:
			return <SettingsPlaceholderPanel order={order} />;
	}
};

interface TViewProps {
	editor: TPageEditor;
	order: number;
}
