import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, LayersPanel, NodeInspectorPanel } from '../panels';

export const DesignView: React.FC<TDesignViewProps> = (props) => {
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
				<LayersPanel editor={editor} />
				<ResizableHandle className="bg-neutral-200" />
				<CanvasPanel editor={editor} />
				<ResizableHandle className="bg-neutral-200" />
				<NodeInspectorPanel editor={editor} />
			</>
		);
	}

	return (
		<>
			<CanvasPanel editor={editor} />
			<NodeInspectorPanel editor={editor} withResizableHandle />
			<LayersPanel editor={editor} withResizableHandle />
		</>
	);
};

interface TDesignViewProps {
	editor: TPageEditor;
}
