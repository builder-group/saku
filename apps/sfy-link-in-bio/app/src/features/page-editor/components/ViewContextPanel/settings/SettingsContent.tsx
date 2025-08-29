import { useFeatureState } from 'feature-react';
import React from 'react';
import { TPageEditor } from '../../../lib';
import { AssetsContent } from './AssetsContent';
import { DesignContent } from './DesignContent';
import { IntegrationsContent } from './IntegrationsContent';
import { MetadataContent } from './MetadataContent';
import { SettingsContentPlaceholder } from './SettingsContentPlaceholder';

export const SettingsContent: React.FC<TSettingsContentProps> = (props) => {
	const { editor } = props;

	const selectedSection = useFeatureState(editor.activeSettingsSection);

	switch (selectedSection) {
		case 'design':
			return <DesignContent editor={editor} />;
		case 'metadata':
			return <MetadataContent editor={editor} />;
		case 'assets':
			return <AssetsContent editor={editor} />;
		case 'integrations':
			return <IntegrationsContent editor={editor} />;
		default:
			return <SettingsContentPlaceholder />;
	}
};

interface TSettingsContentProps {
	editor: TPageEditor;
}
