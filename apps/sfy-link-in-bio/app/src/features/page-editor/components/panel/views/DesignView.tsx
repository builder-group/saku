import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, LayersPanel, NodeInspectorPanel } from '../panels';

export const DesignView: React.FC<TDesignViewProps> = (props) => {
	const { editor, order } = props;
	const isMd = useEditorBreakpoint(editor, 'md');

	if (isMd) {
		return (
			<>
				<LayersPanel editor={editor} order={order} />
				<ResizableHandle className="bg-neutral-200" />
				<CanvasPanel editor={editor} order={order + 1} />
				<ResizableHandle className="bg-neutral-200" />
				<NodeInspectorPanel editor={editor} order={order + 2} />
			</>
		);
	}

	return (
		<>
			<CanvasPanel editor={editor} order={order} />
			<NodeInspectorPanel editor={editor} order={order + 1} withResizableHandle />
			<ResizableHandle className="bg-neutral-200" withHandle />
			<LayersPanel editor={editor} order={order + 2} />
		</>
	);
};

interface TDesignViewProps {
	editor: TPageEditor;
	order: number;
}
