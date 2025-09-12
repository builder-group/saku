import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { IntegrationDetailsPanel, SettingsIntegrationsPanel } from '../panels';

export const SettingsIntegrationsView: React.FC<TSettingsIntegrationsViewProps> & {
	panelCount: number;
} = (props) => {
	const { editor, order } = props;
	const isMd = useEditorBreakpoint(editor, 'md');

	// Force panel layout recompute on mount to prevent resize-panel issues
	const [, forceRender] = React.useReducer((s: number) => s + 1, 0);
	React.useLayoutEffect(() => {
		forceRender();
	}, []);

	if (isMd) {
		return (
			<>
				<SettingsIntegrationsPanel editor={editor} order={order} />
				<ResizableHandle className="bg-neutral-200" />
				<IntegrationDetailsPanel editor={editor} order={order + 1} />
			</>
		);
	}

	return (
		<>
			<SettingsIntegrationsPanel editor={editor} order={order} />
		</>
	);
};
SettingsIntegrationsView.panelCount = 2;

interface TSettingsIntegrationsViewProps {
	editor: TPageEditor;
	order: number;
}
