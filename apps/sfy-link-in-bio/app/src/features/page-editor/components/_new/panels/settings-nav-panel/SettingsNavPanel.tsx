import { Icon, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React from 'react';
import { ChevronRightIcon, ResizablePanel } from '@/components';
import { cn } from '@/lib';
import { settingsMetadata, TSettingsSectionType } from '../../../../environment';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../../PanelHeader';

export const SettingsNavPanel: React.FC<TSettingsNavPanelProps> = (props) => {
	const { editor, order } = props;

	const selectedSection = useFeatureState(editor.activeSettingsSection);

	// TODO: Figure out better solution
	// https://github.com/bvaughn/react-resizable-panels/issues/46
	const sizes = useCompute(
		editor.boundingRect,
		({ value: rect }) => {
			const width = rect.right - rect.left;
			if (width <= 0) {
				// Note: Return default sizes instead of null to prevent the panel from being hidden on hot reload
				return {
					minSize: 10,
					defaultSize: 15,
					maxSize: 20
				};
			}

			const toPercent = (pixels: number) => (pixels / width) * 100;

			return {
				minSize: toPercent(150), // ~ 10
				defaultSize: toPercent(225), // ~ 15
				maxSize: toPercent(300) // ~ 20
			};
		},
		[],
		{
			isEqual(a, b) {
				return (
					a.minSize === b.minSize && a.defaultSize === b.defaultSize && a.maxSize === b.maxSize
				);
			}
		}
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleSectionSelect = React.useCallback(
		(section: TSettingsSectionType) => {
			editor.switchSettingsSection(section === selectedSection ? null : section);
		},
		[editor, selectedSection]
	);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			id="settings-nav-panel"
			order={order}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
		>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<Text as="h2" variant="headingMd">
						Settings
					</Text>
				</PanelHeader>
				<div>
					{settingsMetadata.map((section) => (
						<div
							key={section.type}
							className={cn(
								'flex cursor-pointer items-center justify-between border-b border-neutral-200 px-4 py-3 hover:bg-neutral-50',
								selectedSection === section.type && 'bg-neutral-100'
							)}
							onClick={() => handleSectionSelect(section.type as TSettingsSectionType)}
							role="button"
							tabIndex={0}
							aria-selected={selectedSection === section.type}
						>
							<Text as="h3" variant="headingSm">
								{section.label}
							</Text>
							<span className="ml-2">
								<Icon source={ChevronRightIcon} tone="subdued" />
							</span>
						</div>
					))}
				</div>
			</div>
		</ResizablePanel>
	);
};

interface TSettingsNavPanelProps {
	editor: TPageEditor;
	order: number;
}
