import React from 'react';
import { ResizablePanel } from '@/components';
import { TPageEditor } from '../../../../lib';

export const IntegrationDetailsPanel: React.FC<TIntegrationDetailsPanelProps> = (props) => {
	const { editor } = props;

	return <ResizablePanel id="integration-details-panel" className="bg-white" />;
};

interface TIntegrationDetailsPanelProps {
	editor: TPageEditor;
}
