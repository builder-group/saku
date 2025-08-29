import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, SettingsAssetsPanel } from '../panels';

export const SettingsAssetsView: React.FC<TSettingsAssetsViewProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<SettingsAssetsPanel editor={editor} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<CanvasPanel editor={editor} />
		</>
	);
};

interface TSettingsAssetsViewProps {
	editor: TPageEditor;
}
