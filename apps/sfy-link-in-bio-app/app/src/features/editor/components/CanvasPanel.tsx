import React from 'react';
import { ResizablePanel } from '@/components';
import { PanelHeader } from './PanelHeader';

export const CanvasPanel: React.FC = () => {
	return (
		<ResizablePanel>
			<PanelHeader className="justify-end">Canvas Header</PanelHeader>

			<div className="flex h-full flex-1 items-center justify-center bg-gray-50 p-4">Canvas</div>
		</ResizablePanel>
	);
};
