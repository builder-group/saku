import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { AssetDetailsPanel, SettingsAssetsPanel } from '../panels';

export const SettingsAssetsView: React.FC<TSettingsAssetsViewProps> = (props) => {
	const { editor, order } = props;
	const isMd = useEditorBreakpoint(editor, 'md');

	if (isMd) {
		return (
			<>
				<SettingsAssetsPanel editor={editor} order={order} />
				<ResizableHandle className="bg-neutral-200" />
				<AssetDetailsPanel editor={editor} order={order + 1} />
			</>
		);
	}

	return (
		<>
			<SettingsAssetsPanel editor={editor} order={order} />
		</>
	);
};

interface TSettingsAssetsViewProps {
	editor: TPageEditor;
	order: number;
}
