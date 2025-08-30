import { Button } from '@shopify/polaris';
import React from 'react';
import { ViewIcon } from '@/components';
import { TPageEditor } from '../../../../lib';
import { PublishButton } from '../../../input';
import { PanelHeader as PanelHeaderBase } from '../../../PanelHeader';

export const PanelHeader: React.FC<TPanelHeaderProps> = (props) => {
	const { editor } = props;

	// =========================================================================
	// Events
	// =========================================================================

	const handlePreview = React.useCallback(() => {
		editor.switchView('preview');
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<PanelHeaderBase className="justify-end">
			<div className="flex items-center gap-2">
				<Button
					icon={ViewIcon}
					variant="secondary"
					onClick={handlePreview}
					accessibilityLabel="Preview your Link In Bio page"
				/>
				<PublishButton editor={editor} />
			</div>
		</PanelHeaderBase>
	);
};

interface TPanelHeaderProps {
	editor: TPageEditor;
}
