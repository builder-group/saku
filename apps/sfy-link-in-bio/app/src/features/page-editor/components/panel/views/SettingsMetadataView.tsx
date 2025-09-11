import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { MetadataPreviewPanel, SettingsMetadataPanel } from '../panels';

export const SettingsMetadataView: React.FC<TSettingsMetadataViewProps> = (props) => {
	const { editor, order } = props;
	const isMd = useEditorBreakpoint(editor, 'md');

	if (isMd) {
		return (
			<>
				<SettingsMetadataPanel editor={editor} order={order} />
				<ResizableHandle className="bg-neutral-200" />
				<MetadataPreviewPanel editor={editor} order={order + 1} />
			</>
		);
	}

	return (
		<>
			<SettingsMetadataPanel editor={editor} order={order} />
		</>
	);
};

interface TSettingsMetadataViewProps {
	editor: TPageEditor;
	order: number;
}
