import React from 'react';
import { TPageEditor } from '../../../lib';
import { SettingsAdvancedPanel } from '../panels';

export const SettingsAdvancedView: React.FC<TSettingsAdvancedViewProps> & { panelCount: number } = (
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
			<SettingsAdvancedPanel editor={editor} order={order} />
		</>
	);
};
SettingsAdvancedView.panelCount = 1;

interface TSettingsAdvancedViewProps {
	editor: TPageEditor;
	order: number;
}
