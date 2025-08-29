import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, SettingsIntegrationsPanel } from '../panels';

export const SettingsIntegrationsView: React.FC<TSettingsIntegrationsViewProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<SettingsIntegrationsPanel editor={editor} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<CanvasPanel editor={editor} />
		</>
	);
};

interface TSettingsIntegrationsViewProps {
	editor: TPageEditor;
}
