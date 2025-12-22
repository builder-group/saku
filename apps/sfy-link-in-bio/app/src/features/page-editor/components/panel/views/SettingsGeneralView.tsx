import React from 'react';
import { TPageEditor } from '../../../lib';
import { SettingsGeneralPanel } from '../panels';

export const SettingsGeneralView: React.FC<TSettingsGeneralViewProps> = (props) => {
	const { editor } = props;

	// Force panel layout recompute on mount to prevent resize-panel issues
	const [, forceRender] = React.useReducer((s: number) => s + 1, 0);
	React.useLayoutEffect(() => {
		forceRender();
	}, []);

	return (
		<>
			<SettingsGeneralPanel editor={editor} />
		</>
	);
};

interface TSettingsGeneralViewProps {
	editor: TPageEditor;
}
