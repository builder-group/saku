import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, SettingsDesignPanel } from '../panels';

export const SettingsDesignView: React.FC<TSettingsDesignViewProps> = (props) => {
	const { editor, order } = props;

	return (
		<>
			<SettingsDesignPanel editor={editor} order={order} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<CanvasPanel editor={editor} order={order + 1} />
		</>
	);
};

interface TSettingsDesignViewProps {
	editor: TPageEditor;
	order: number;
}
