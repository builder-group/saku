import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { MetadataPreviewPanel, SettingsMetadataPanel } from '../panels';

export const SettingsMetadataView: React.FC<TSettingsMetadataViewProps> & { panelCount: number } = (
	props
) => {
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
SettingsMetadataView.panelCount = 2;

interface TSettingsMetadataViewProps {
	editor: TPageEditor;
	order: number;
}
