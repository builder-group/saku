import React from 'react';
import { TPageEditor } from '../../../lib';
import { SettingsAdvancedPanel } from '../panels';

export const SettingsAdvancedView: React.FC<TSettingsAdvancedViewProps> = (props) => {
	const { editor } = props;

	// Force panel layout recompute on mount to prevent resize-panel issues
	const [, forceRender] = React.useReducer((s: number) => s + 1, 0);
	React.useLayoutEffect(() => {
		forceRender();
	}, []);

	return (
		<>
			<SettingsAdvancedPanel editor={editor} />
		</>
	);
};

interface TSettingsAdvancedViewProps {
	editor: TPageEditor;
}
