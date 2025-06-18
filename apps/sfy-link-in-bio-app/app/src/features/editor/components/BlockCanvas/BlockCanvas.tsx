import { notEmpty } from '@blgc/utils';
import { useCompute } from 'feature-react';
import React from 'react';
import { TEditor } from '../../lib';
import { Block } from './Block';

export const BlockCanvas: React.FC<TCanvasProps> = (props) => {
	const { editor } = props;

	const blocks = useCompute(editor.blockIds, (blocks) => {
		return blocks.map((blockId) => editor.blockMap[blockId]).filter(notEmpty);
	});

	if (blocks.length === 0) {
		return null;
	}

	return (
		<div className="flex w-full flex-col items-center gap-4">
			{blocks.map((block) => (
				<Block key={block._v.id} blockState={block} editor={editor} />
			))}
		</div>
	);
};

interface TCanvasProps {
	editor: TEditor;
}
