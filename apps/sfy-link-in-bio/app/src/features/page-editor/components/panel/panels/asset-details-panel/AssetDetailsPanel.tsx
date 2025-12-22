import React from 'react';
import { ResizablePanel } from '@/components';
import { TPageEditor } from '../../../../lib';

export const AssetDetailsPanel: React.FC<TAssetDetailsPanelProps> = (props) => {
	const { editor } = props;

	return <ResizablePanel id="asset-details-panel" className="bg-white" />;
};

interface TAssetDetailsPanelProps {
	editor: TPageEditor;
}
