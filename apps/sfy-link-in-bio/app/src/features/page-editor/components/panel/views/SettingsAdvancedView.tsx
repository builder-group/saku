import React from 'react';
import { TPageEditor } from '../../../lib';
import { SettingsAdvancedPanel } from '../panels';

export const SettingsAdvancedView: React.FC<TSettingsAdvancedViewProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<SettingsAdvancedPanel editor={editor} />
		</>
	);
};

interface TSettingsAdvancedViewProps {
	editor: TPageEditor;
}
