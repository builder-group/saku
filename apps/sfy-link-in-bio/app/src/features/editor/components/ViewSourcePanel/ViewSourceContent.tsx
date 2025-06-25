import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { TEditor } from '../../lib';
import { BlocksContent } from './blocks';
import { SettingsContent } from './settings';

export const ViewSourceContent: React.FC<TViewSourceContentProps> = (props) => {
	const { editor } = props;
	const activeView = useFeatureState(editor.activeView);

	switch (activeView) {
		case 'blocks':
			return <BlocksContent editor={editor} />;
		case 'settings':
			return <SettingsContent />;
	}
};

interface TViewSourceContentProps {
	editor: TEditor;
}
