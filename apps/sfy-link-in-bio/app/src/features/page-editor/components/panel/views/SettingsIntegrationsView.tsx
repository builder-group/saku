import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { IntegrationDetailsPanel, SettingsIntegrationsPanel } from '../panels';

export const SettingsIntegrationsView: React.FC<TSettingsIntegrationsViewProps> = (props) => {
	const { editor, order } = props;
	const isMd = useEditorBreakpoint(editor, 'md');

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

interface TSettingsIntegrationsViewProps {
	editor: TPageEditor;
	order: number;
}
