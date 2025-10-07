import { Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react';
import React from 'react';
import { CopyIdSection, DeleteSiteSection, FormSection, ResizablePanel } from '@/components';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';

export const SettingsGeneralPanel: React.FC<TSettingsGeneralPanelProps> = (props) => {
	const { editor, order } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const displayName = useFeatureState(editor.site.displayName);
	const handle = useFeatureState(editor.site.handle);

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
	// Events
	// =========================================================================

	const handleSiteNameUpdate = React.useCallback(
		async (newName: string) => {
			await editor.updateSiteDisplayName(newName);
		},
		[editor]
	);

	const handleSiteHandleUpdate = React.useCallback(
		async (newHandle: string) => {
			await editor.updateSiteHandle(newHandle);
		},
		[editor]
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

				<div className="h-full flex-1 overflow-y-auto p-4">
					<div className="mx-auto w-full max-w-screen-xl space-y-6">
						<FormSection
							title="Site Name"
							description="Update the name of your site."
							inputValue={displayName ?? ''}
							placeholder="Enter site name"
							helpText="Max 32 characters."
							onSubmit={handleSiteNameUpdate}
							maxLength={32}
						/>
						<FormSection
							title="Site Handle"
							description="The URL-friendly identifier for your site."
							inputValue={handle}
							placeholder="bio"
							helpText="Only lowercase letters, numbers, and dashes. Max 50 characters."
							onSubmit={handleSiteHandleUpdate}
							maxLength={50}
						/>
						<CopyIdSection
							id={editor.site.id}
							title="Site ID"
							description="Unique ID of your site on Saku."
							helpText="Used to identify your site when interacting with the Saku API."
						/>
						<DeleteSiteSection
							siteId={editor.site.id}
							title="Delete Site"
							description="Permanently delete your site. This action cannot be undone - please proceed with caution."
							buttonText="Delete Site"
						/>
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
