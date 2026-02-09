import { Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react';
import React from 'react';
import { ResizablePanel } from '@/components';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { CopyIdSection, DeleteSiteSection, FormSection } from './sections';

export const SettingsGeneralPanel: React.FC<TSettingsGeneralPanelProps> = (props) => {
	const { editor } = props;

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
				const toPercent = (pixels: number) => `${(pixels / width) * 100}%`;
				return {
					minSize: toPercent(405)
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
		<ResizablePanel id="settings-general-panel" minSize={sizes.minSize} className="relative">
			<div className="flex h-full flex-col overflow-y-auto bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						General
					</Text>
				</PanelHeader>

				<div className="h-full flex-1 overflow-y-auto p-4">
					<div className="mx-auto w-full max-w-7xl space-y-6">
						<FormSection
							title="Page Name"
							description="Update the name of your bio page."
							inputValue={displayName ?? ''}
							placeholder="Enter page name"
							helpText="Max 32 characters."
							onSubmit={handleSiteNameUpdate}
							maxLength={32}
						/>
						<FormSection
							title="Page Handle"
							description={
								<>
									The URL path for your bio page. Your page will be at{' '}
									<a
										href={`${editor.site.baseUrl.shopify.primary}/${handle}`}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block rounded bg-neutral-100 px-1.5 py-0.5 font-mono hover:bg-neutral-200 hover:text-blue-600 hover:underline"
									>
										{editor.site.baseUrl.shopify.primary}/
										<span className="text-purple-600">{handle}</span>
									</a>
								</>
							}
							inputValue={handle}
							placeholder="bio"
							helpText="Only lowercase letters, numbers, and dashes. Max 50 characters."
							onSubmit={handleSiteHandleUpdate}
							maxLength={50}
						/>
						<CopyIdSection
							id={editor.site.id}
							title="Site ID"
							description="Technical ID for developers. You can ignore this unless you're using the API."
							helpText={undefined}
						/>
						<DeleteSiteSection
							siteId={editor.site.id}
							title="Delete this bio page"
							description="Permanently delete this bio page. This action cannot be undone - please proceed with caution."
							buttonText="Delete page"
						/>
					</div>
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsGeneralPanelProps {
	editor: TPageEditor;
}
