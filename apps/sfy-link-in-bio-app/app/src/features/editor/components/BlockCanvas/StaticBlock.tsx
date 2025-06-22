import React from 'react';
import { type TBlock } from '../../types';
import { StaticAboutBlock, StaticLinkBlock, StaticMediaBlock, StaticTextBlock } from './blocks';

export const StaticBlock: React.FC<TStaticBlockProps> = (props) => {
	const { block } = props;

	switch (block.type) {
		case 'about':
			return <StaticAboutBlock block={block} />;
		case 'link':
			return <StaticLinkBlock block={block} />;
		case 'media':
			return <StaticMediaBlock block={block} />;
		case 'text':
			return <StaticTextBlock block={block} />;
		default:
			return null;
	}
};

interface TStaticBlockProps {
	block: TBlock;
}
