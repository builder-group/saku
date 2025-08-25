import { Text } from '@shopify/polaris';
import React from 'react';
import { TPageEditor } from '../../../lib';
import { PageNodeEditor } from '../../../nodes';
import { PanelHeader } from '../../PanelHeader';

export const DesignContent: React.FC<TDesignContentProps> = (props) => {
	const { editor } = props;

	return (
		<div className="flex h-full flex-col">
			<PanelHeader>
				<Text as="h2" variant="headingMd">
					Design
				</Text>
			</PanelHeader>
			<div className="flex-1 overflow-auto">
				<PageNodeEditor nodeState={editor.getRootNode()} editor={editor} />
			</div>
		</div>
	);
};

interface TDesignContentProps {
	editor: TPageEditor;
}
