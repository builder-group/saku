import { TState } from 'feature-state';
import React from 'react';
import { TBlock } from '../../../environment';
import { TEditor } from '../../../lib';
import { BlockEditor } from '../../BlockEditor';

export const BlocksContentCustomizeTab: React.FC<TBlocksContentCustomizeTabProps> = (props) => {
	const { blockState, editor } = props;

	return <BlockEditor blockState={blockState} editor={editor} />;
};

interface TBlocksContentCustomizeTabProps {
	blockState: TState<TBlock, []>;
	editor: TEditor;
}
