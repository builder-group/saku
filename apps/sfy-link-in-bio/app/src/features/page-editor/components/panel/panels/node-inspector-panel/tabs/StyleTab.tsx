import React from 'react';
import { PersistableBanner } from '@/components';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { NodeStyleEditor } from '../../../../node';

export const StyleTab: React.FC<TStyleTabProps> = (props) => {
	const { nodeState, editor } = props;

	const handleNavigateToCustomize = React.useCallback(() => {
		editor.switchView({ type: 'settings', view: { type: 'design', tab: 1 } });
	}, [editor]);

	return (
		<>
			<PersistableBanner storageKey="style-tab_show-info-banner" tone="info" className="p-2">
				These are layer-specific styles that only apply to this layer. If you want to change the
				global styles for all layers, go to{' '}
				<button
					type="button"
					onClick={handleNavigateToCustomize}
					className="inline cursor-pointer underline hover:no-underline"
					aria-label="Navigate to Settings &gt; Customize"
				>
					Settings &gt; Customize
				</button>
				.
			</PersistableBanner>
			<NodeStyleEditor nodeState={nodeState} editor={editor} />
		</>
	);
};

interface TStyleTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
