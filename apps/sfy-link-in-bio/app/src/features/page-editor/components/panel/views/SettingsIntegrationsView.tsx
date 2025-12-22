import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { IntegrationDetailsPanel, SettingsIntegrationsPanel } from '../panels';

export const SettingsIntegrationsView: React.FC<TSettingsIntegrationsViewProps> = (props) => {
	const { editor } = props;
	const isMd = useEditorBreakpoint(editor, 'md');

	if (isMd) {
		return (
			<>
				<SettingsIntegrationsPanel editor={editor} />
				<ResizableHandle className="bg-neutral-200" />
				<IntegrationDetailsPanel editor={editor} />
			</>
		);
	}

	return (
		<>
			<SettingsIntegrationsPanel editor={editor} />
		</>
	);
};

interface TSettingsIntegrationsViewProps {
	editor: TPageEditor;
}
