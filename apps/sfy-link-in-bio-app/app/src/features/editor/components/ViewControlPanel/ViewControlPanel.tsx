import { Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { ResizablePanel } from '@/components';
import { views } from '../../environment';
import { TEditor } from '../../lib';
import { PanelHeader } from '../PanelHeader';
import { ViewControlContent } from './ViewControlContent';

export const ViewControlPanel: React.FC<TViewControlPanelProps> = (props) => {
	const { editor } = props;
	const activeView = useFeatureState(editor.activeView);

	return (
		<ResizablePanel minSize={15} defaultSize={20} maxSize={25}>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						{views[activeView].label}
					</Text>
				</PanelHeader>

				<ViewControlContent editor={editor} />
			</div>
		</ResizablePanel>
	);
};

interface TViewControlPanelProps {
	editor: TEditor;
}
