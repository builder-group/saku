import { Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import React from 'react';
import { FormSection, ResizablePanel } from '@/components';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';

export const SettingsGeneralPanel: React.FC<TSettingsGeneralPanelProps> = (props) => {
	const { editor, order } = props;

	const isMd = useEditorBreakpoint(editor, 'md');

	const handleWorkspaceNameUpdate = React.useCallback(async (newName: string) => {
		console.log('Updating workspace name to:', newName);
		// TODO: Implement actual API call to update workspace name
		// await api.updateWorkspaceName(newName);
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				console.log('Workspace name updated successfully:', newName);
				resolve();
			}, 1000);
		});
	}, []);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			// Desktop (horizontal layout): Resizable based on width
			if (isMd) {
				const width = rect.right - rect.left;
				const toPercent = (pixels: number) => (pixels / (width > 0 ? width : 15)) * 100;
				return {
					minSize: toPercent(405) // ~ 27
				};
			}

			// Mobile (vertical layout): Resizable based on height
			return {
				minSize: undefined
			};
		},
		[isMd],
		{
			isEqual(a, b) {
				return a.minSize === b.minSize;
			}
		}
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			id="settings-general-panel"
			order={order}
			minSize={sizes.minSize}
			className="relative"
		>
			<div className="flex h-full flex-col overflow-y-auto bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						General
					</Text>
				</PanelHeader>

				<div className="flex-1 p-4">
					<div className="mx-auto w-full max-w-screen-xl space-y-6">
						<FormSection
							title="Workspace Name"
							description="Update the name of your workspace."
							inputValue="My Awesome Site"
							placeholder="Enter workspace name"
							helpText="Max 32 characters."
							onSubmit={handleWorkspaceNameUpdate}
							maxLength={32}
						/>

						{/* TODO: Add more sections - Slug - Id (just copy) - Delete Site */}
					</div>
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsGeneralPanelProps {
	editor: TPageEditor;
	order: number;
}
