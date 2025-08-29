import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, SettingsDesignPanel } from '../panels';

export const SettingsDesignView: React.FC<TSettingsDesignViewProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<SettingsDesignPanel editor={editor} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<CanvasPanel editor={editor} />
		</>
	);
};

interface TSettingsDesignViewProps {
	editor: TPageEditor;
}
