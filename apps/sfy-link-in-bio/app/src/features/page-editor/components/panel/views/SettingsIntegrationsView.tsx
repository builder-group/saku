import { useFeatureState } from 'feature-react/state';
import React from 'react';
import { ResizableHandle } from '@/components';
import { useEditorBreakpoint } from '../../../hooks';
import { TPageEditor } from '../../../lib';
import {
	IntegrationDetailsPanel,
	integrationTypeOrder,
	SettingsIntegrationsPanel
} from '../panels';

export const SettingsIntegrationsView: React.FC<TSettingsIntegrationsViewProps> = (props) => {
	const { editor } = props;
	const isMd = useEditorBreakpoint(editor, 'md');
	const selectedIntegrationId = useFeatureState(editor.selectedIntegrationId);
	const integrations = useFeatureState(editor.integrationsMap);
	const sortedIntegrationIds = React.useMemo(
		() =>
			Object.values(integrations)
				.sort((a, b) => integrationTypeOrder[a.type] - integrationTypeOrder[b.type])
				.map((integration) => integration.id),
		[integrations]
	);

	React.useEffect(() => {
		const firstIntegrationId = sortedIntegrationIds[0];
		if (firstIntegrationId == null) {
			if (selectedIntegrationId != null) {
				editor.unselectIntegration();
			}
			return;
		}

		if (
			selectedIntegrationId == null ||
			sortedIntegrationIds.includes(selectedIntegrationId) === false
		) {
			editor.selectIntegration(firstIntegrationId);
		}
	}, [editor, selectedIntegrationId, sortedIntegrationIds]);

	// =========================================================================
	// UI
	// =========================================================================

	if (isMd) {
		return (
			<>
				<SettingsIntegrationsPanel editor={editor} />
				<ResizableHandle className="bg-neutral-200" />
				<IntegrationDetailsPanel editor={editor} />
			</>
		);
	}

	return (
		<>
			<SettingsIntegrationsPanel editor={editor} />
			<ResizableHandle className="bg-neutral-200" withHandle />
			<IntegrationDetailsPanel editor={editor} />
		</>
	);
};

interface TSettingsIntegrationsViewProps {
	editor: TPageEditor;
}
