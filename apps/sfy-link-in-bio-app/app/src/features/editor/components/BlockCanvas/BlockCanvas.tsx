import { notEmpty } from '@blgc/utils';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { TAboutBlock, TLinkBlock, TMediaBlock, TTextBlock } from '../../environment';
import { TEditor } from '../../lib';
import { AboutBlock, LinkBlock, MediaBlock, TextBlock } from './blocks/';

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
			{blocks.map((block) => {
				switch (block._v.type) {
					case 'about':
						return <AboutBlock key={block._v.id} blockState={block as TState<TAboutBlock, []>} />;
					case 'link':
						return <LinkBlock key={block._v.id} blockState={block as TState<TLinkBlock, []>} />;
					case 'media':
						return <MediaBlock key={block._v.id} blockState={block as TState<TMediaBlock, []>} />;
					case 'text':
						return <TextBlock key={block._v.id} blockState={block as TState<TTextBlock, []>} />;
					default:
						return null;
				}
			})}
		</div>
	);
};

type TCanvasProps = {
	editor: TEditor;
};
