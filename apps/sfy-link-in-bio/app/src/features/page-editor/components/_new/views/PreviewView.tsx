import React from 'react';
import { TPageEditor } from '../../../lib';
import { PreviewPanel } from '../panels';

export const PreviewView: React.FC<TPreviewViewProps> = (props) => {
	const { editor } = props;

	return <PreviewPanel editor={editor} />;
};

interface TPreviewViewProps {
	editor: TPageEditor;
}
