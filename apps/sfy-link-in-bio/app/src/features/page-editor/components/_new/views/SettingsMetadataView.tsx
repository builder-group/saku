import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, SettingsMetadataPanel } from '../panels';

export const SettingsMetadataView: React.FC<TSettingsMetadataViewProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<SettingsMetadataPanel editor={editor} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<CanvasPanel editor={editor} />
		</>
	);
};

interface TSettingsMetadataViewProps {
	editor: TPageEditor;
}
