import React from 'react';
import { TPageEditor } from '../../../lib';
import { PageNodeEditor } from '../../../nodes';

export const DesignContentCustomizeTab: React.FC<TDesignContentCustomizeTabProps> = (props) => {
	const { editor } = props;

	return <PageNodeEditor nodeState={editor.getRootNode()} editor={editor} />;
};

interface TDesignContentCustomizeTabProps {
	editor: TPageEditor;
}
