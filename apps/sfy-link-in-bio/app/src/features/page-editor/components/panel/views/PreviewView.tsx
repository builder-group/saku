import React from 'react';
import { TPageEditor } from '../../../lib';
import { PreviewPanel } from '../panels';

export const PreviewView: React.FC<TPreviewViewProps> = (props) => {
	const { editor, order } = props;

	return <PreviewPanel editor={editor} order={order} />;
};

interface TPreviewViewProps {
	editor: TPageEditor;
	order: number;
}
