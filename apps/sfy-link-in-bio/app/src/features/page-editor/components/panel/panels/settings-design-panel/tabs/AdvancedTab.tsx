import React from 'react';
import { TPageEditor } from '../../../../../lib';
import { PageNodeEditor } from '../../../../../nodes';

export const AdvancedTab: React.FC<TAdvancedTabProps> = (props) => {
	const { editor } = props;

	return <PageNodeEditor nodeState={editor.getRootNode()} editor={editor} />;
};

interface TAdvancedTabProps {
	editor: TPageEditor;
}
