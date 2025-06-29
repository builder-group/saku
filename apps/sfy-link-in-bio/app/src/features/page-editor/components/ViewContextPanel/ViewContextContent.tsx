import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { TPageEditor } from '../../lib';
import { LayersContent } from './layers';
import { SettingsContent } from './settings';

export const ViewContextContent: React.FC<TViewContextContentProps> = (props) => {
	const { editor } = props;
	const activeView = useFeatureState(editor.activeView);

	switch (activeView) {
		case 'layers':
			return <LayersContent editor={editor} />;
		case 'settings':
			return <SettingsContent editor={editor} />;
	}
};

interface TViewContextContentProps {
	editor: TPageEditor;
}
