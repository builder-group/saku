import React from 'react';
import { TPageEditor } from '../../../lib';
import { PreviewPanel } from '../panels';

export const PreviewView: React.FC<TPreviewViewProps> & { panelCount: number } = (props) => {
	const { editor, order } = props;

	return <PreviewPanel editor={editor} order={order} />;
};
PreviewView.panelCount = 1;

interface TPreviewViewProps {
	editor: TPageEditor;
	order: number;
}
