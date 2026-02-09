import { Button } from '@shopify/polaris';
import React from 'react';
import { PolarisViewIcon } from '@/components';
import { TPageEditor } from '../../../../lib';
import { SaveButton } from '../../../input';
import { PanelHeader as PanelHeaderBase } from '../../PanelHeader';

export const PanelHeader: React.FC<TPanelHeaderProps> = (props) => {
	const { editor } = props;

	// =========================================================================
	// Events
	// =========================================================================

	const handlePreview = React.useCallback(() => {
		editor.switchView({ type: 'preview' });
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<PanelHeaderBase className="justify-end">
			<div className="flex items-center gap-2">
				<Button
					icon={PolarisViewIcon}
					variant="secondary"
					onClick={handlePreview}
					accessibilityLabel="Preview your bio page"
				/>
				<SaveButton editor={editor} />
			</div>
		</PanelHeaderBase>
	);
};

interface TPanelHeaderProps {
	editor: TPageEditor;
}
