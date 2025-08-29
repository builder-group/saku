import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, SettingsMetadataPanel } from '../panels';

export const SettingsMetadataView: React.FC<TSettingsMetadataViewProps> = (props) => {
	const { editor, order } = props;

	return (
		<>
			<SettingsMetadataPanel editor={editor} order={order} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<CanvasPanel editor={editor} order={order + 1} />
		</>
	);
};

interface TSettingsMetadataViewProps {
	editor: TPageEditor;
	order: number;
}
