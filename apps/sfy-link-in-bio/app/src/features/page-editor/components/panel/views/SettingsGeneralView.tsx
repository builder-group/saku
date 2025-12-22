import React from 'react';
import { TPageEditor } from '../../../lib';
import { SettingsGeneralPanel } from '../panels';

export const SettingsGeneralView: React.FC<TSettingsGeneralViewProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<SettingsGeneralPanel editor={editor} />
		</>
	);
};

interface TSettingsGeneralViewProps {
	editor: TPageEditor;
}
