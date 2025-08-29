import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, SettingsAssetsPanel } from '../panels';

export const SettingsAssetsView: React.FC<TSettingsAssetsViewProps> = (props) => {
	const { editor, order } = props;

	return (
		<>
			<SettingsAssetsPanel editor={editor} order={order} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<CanvasPanel editor={editor} order={order + 1} />
		</>
	);
};

interface TSettingsAssetsViewProps {
	editor: TPageEditor;
	order: number;
}
