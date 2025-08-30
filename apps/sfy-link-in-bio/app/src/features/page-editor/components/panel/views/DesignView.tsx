import React from 'react';
import { ResizableHandle } from '@/components';
import { TPageEditor } from '../../../lib';
import { CanvasPanel, LayersPanel, NodeInspectorPanel } from '../panels';

export const DesignView: React.FC<TDesignViewProps> = (props) => {
	const { editor, order } = props;

	return (
		<>
			<LayersPanel editor={editor} order={order} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<CanvasPanel editor={editor} order={order + 1} />
			<ResizableHandle className="w-px bg-neutral-200" />
			<NodeInspectorPanel editor={editor} order={order + 2} />
		</>
	);
};

interface TDesignViewProps {
	editor: TPageEditor;
	order: number;
}
