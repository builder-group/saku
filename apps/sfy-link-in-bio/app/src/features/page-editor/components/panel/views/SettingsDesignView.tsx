import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, SettingsDesignPanel } from '../panels';

export const SettingsDesignView: React.FC<TSettingsDesignViewProps> = (props) => {
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
				<SettingsDesignPanel editor={editor} order={order} />
				<ResizableHandle className="bg-neutral-200" />
				<CanvasPanel editor={editor} order={order + 1} />
			</>
		);
	}

	return (
		<>
			<SettingsDesignPanel editor={editor} order={order} />
		</>
	);
};

interface TSettingsDesignViewProps {
	editor: TPageEditor;
	order: number;
}
