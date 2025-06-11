import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { TEditor } from '../../lib';
import { BlocksContent } from './BlocksContent';
import { SettingsContent } from './SettingsContent';

export const ViewControlContent: React.FC<TViewControlContentProps> = (props) => {
	const { editor } = props;
	const activeView = useFeatureState(editor.activeView);

	switch (activeView) {
		case 'blocks':
			return <BlocksContent />;
		case 'settings':
			return <SettingsContent />;
	}
};

interface TViewControlContentProps {
	editor: TEditor;
}
