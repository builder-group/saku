import React from 'react';
import { TPageEditor } from '../../../lib';
import { SettingsDebugPanel } from '../panels';

export const SettingsDebugView: React.FC<TSettingsDebugViewProps> & { panelCount: number } = (
	props
) => {
	const { editor, order } = props;

	// Force panel layout recompute on mount to prevent resize-panel issues
	const [, forceRender] = React.useReducer((s: number) => s + 1, 0);
	React.useLayoutEffect(() => {
		forceRender();
	}, []);

	return (
		<>
			<SettingsDebugPanel editor={editor} order={order} />
		</>
	);
};
SettingsDebugView.panelCount = 1;

interface TSettingsDebugViewProps {
	editor: TPageEditor;
	order: number;
}
