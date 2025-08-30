import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { IntegrationDetailsPanel, SettingsIntegrationsPanel } from '../panels';

export const SettingsIntegrationsView: React.FC<TSettingsIntegrationsViewProps> = (props) => {
	const { editor, order } = props;

	return (
		<>
			<SettingsIntegrationsPanel editor={editor} order={order} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<IntegrationDetailsPanel editor={editor} order={order + 1} />
		</>
	);
};

interface TSettingsIntegrationsViewProps {
	editor: TPageEditor;
	order: number;
}
