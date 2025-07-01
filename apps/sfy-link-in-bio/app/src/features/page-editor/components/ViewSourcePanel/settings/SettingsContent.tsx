import { Icon, Text } from '@shopify/polaris';
import { useFeatureState } from 'feature-react';
import React from 'react';
import { ChevronRightIcon } from '@/components';
import { cn } from '@/lib';
import { settingsMetadata, TSettingsSectionType } from '../../../environment';
import { TPageEditor } from '../../../lib';
import { PanelHeader } from '../../PanelHeader';

export const SettingsContent: React.FC<TSettingsContentProps> = (props) => {
	const { editor } = props;

	const selectedSection = useFeatureState(editor.activeSettingsSection);

	const handleSectionSelect = React.useCallback(
		(section: TSettingsSectionType) => {
			editor.switchSettingsSection(section === selectedSection ? null : section);
		},
		[editor, selectedSection]
	);

	return (
		<div className="h-full">
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
	);
};

interface TSettingsContentProps {
	editor: TPageEditor;
}
