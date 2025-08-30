import React from 'react';
import { ResizablePanel } from '@/components';
import { TPageEditor } from '../../../../lib';

export const AssetDetailsPanel: React.FC<TAssetDetailsPanelProps> = (props) => {
	const { editor, order } = props;

	return <ResizablePanel id="asset-details-panel" order={order} className="bg-white" />;
};

interface TAssetDetailsPanelProps {
	editor: TPageEditor;
	order: number;
}
