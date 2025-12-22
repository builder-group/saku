import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { AssetDetailsPanel, SettingsAssetsPanel } from '../panels';

export const SettingsAssetsView: React.FC<TSettingsAssetsViewProps> = (props) => {
	const { editor } = props;
	const isMd = useEditorBreakpoint(editor, 'md');

	// Force panel layout recompute on mount to prevent resize-panel issues
	const [, forceRender] = React.useReducer((s: number) => s + 1, 0);
	React.useLayoutEffect(() => {
		forceRender();
	}, []);

	if (isMd) {
		return (
			<>
				<SettingsAssetsPanel editor={editor} />
				<ResizableHandle className="bg-neutral-200" />
				<AssetDetailsPanel editor={editor} />
			</>
		);
	}

	return (
		<>
			<SettingsAssetsPanel editor={editor} />
		</>
	);
};

interface TSettingsAssetsViewProps {
	editor: TPageEditor;
}
