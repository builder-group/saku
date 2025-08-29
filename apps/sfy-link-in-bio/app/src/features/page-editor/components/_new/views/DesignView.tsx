import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, LayersPanel, NodeInspectorPanel } from '../panels';

export const DesignView: React.FC<TDesignViewProps> = (props) => {
	const { editor } = props;

	return (
		<>
			<LayersPanel editor={editor} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<CanvasPanel editor={editor} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<NodeInspectorPanel editor={editor} />
		</>
	);
};

interface TDesignViewProps {
	editor: TPageEditor;
}
