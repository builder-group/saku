import React from 'react';
import { TPageEditor } from '../../../../../lib';
import { PageNodeEditor } from '../../../../../nodes';

export const CustomizeTab: React.FC<TCustomizeTabProps> = (props) => {
	const { editor } = props;

	return <PageNodeEditor nodeState={editor.getRootNode()} editor={editor} />;
};

interface TCustomizeTabProps {
	editor: TPageEditor;
}
