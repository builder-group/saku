import { Button, Icon, Text } from '@shopify/polaris';
import { useCompute, useFeatureState } from 'feature-react/state';
import React, { Ref } from 'react';
import { PanelImperativeHandle, usePanelRef } from 'react-resizable-panels';
import {
	PolarisChevronDownIcon,
	PolarisChevronRightIcon,
	PolarisChevronUpIcon,
	ResizablePanel
} from '@/components';
import { cn } from '@/lib';
import {
	ESettingsCondition,
	settingsMetadata,
	TSettingsSectionType
} from '../../../../environment';
import { useEditorBreakpoint } from '../../../../hooks';
import { TPageEditor } from '../../../../lib';
import { PanelHeader } from '../../PanelHeader';
import { MobileNavPanel } from '../nav-panel';

export const SettingsNavPanel: React.FC<TSettingsNavPanelProps> = (props) => {
	const { editor } = props;

	const isMd = useEditorBreakpoint(editor, 'md');
	const [collapsed, setCollapsed] = React.useState(false);
	const selectedSection = useFeatureState(editor.activeSettingsSection);
	const panelRef = usePanelRef();

	const filteredSettingsMetadata = React.useMemo(() => {
		return settingsMetadata.filter((section) => {
			if (section.condition.has(ESettingsCondition.Debug)) {
				return editor.isDebug();
			}
			return true;
		});
	}, [editor]);

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
					collapsedSize: undefined,
					minSize: toPercent(150),
					defaultSize: toPercent(225),
					maxSize: toPercent(300)
				};
			}

			// Mobile (vertical layout): Resizable based on height
			const height = rect.bottom - rect.top - MobileNavPanel.height;
			const toPercent = (pixels: number) => `${(pixels / height) * 100}%`;
			return {
				collapsedSize: toPercent(47),
				minSize: toPercent(150),
				defaultSize: toPercent(225),
				maxSize: toPercent(450)
			};
		},
		[isMd],
		{
			isEqual(a, b) {
				return (
					a.collapsedSize === b.collapsedSize &&
					a.minSize === b.minSize &&
					a.defaultSize === b.defaultSize &&
					a.maxSize === b.maxSize
				);
			}
		}
	);

	// =========================================================================
	// Events
	// =========================================================================

	const handleSectionSelect = React.useCallback(
		(section: TSettingsSectionType) => {
			editor.switchSettingsView({ type: section });
		},
		[editor]
	);

	const handleToggleCollapse = React.useCallback(() => {
		// TODO: Make programmatic panel collapse/expand work reliably, the setTimeout workaround seems to work for now
		// https://github.com/bvaughn/react-resizable-panels/issues/515#issuecomment-3285269376
		const panel = panelRef.current;
		if (collapsed) {
			setTimeout(() => {
				panel?.expand();
			});
		} else {
			setTimeout(() => {
				panel?.collapse();
			});
		}
	}, [collapsed]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<ResizablePanel
			panelRef={panelRef as Ref<PanelImperativeHandle>}
			id="settings-nav-panel"
			collapsible={sizes.collapsedSize != null}
			collapsedSize={sizes.collapsedSize}
			minSize={sizes.minSize}
			defaultSize={sizes.defaultSize}
			maxSize={sizes.maxSize}
			onResize={() => {
				setCollapsed(panelRef.current?.isCollapsed() ?? false);
			}}
		>
			<div className="flex h-full flex-col bg-white">
				<PanelHeader>
					<div className="flex w-full items-center justify-between">
						<Text as="h2" variant="headingMd">
							Settings
						</Text>
						{/* Chevron icon for mobile to collapse/expand panel */}
						{!isMd && (
							<Button
								icon={collapsed ? PolarisChevronDownIcon : PolarisChevronUpIcon}
								variant="plain"
								onClick={handleToggleCollapse}
								accessibilityLabel={collapsed ? 'Expand panel' : 'Collapse panel'}
							/>
						)}
					</div>
				</PanelHeader>
				<div className="flex flex-1 flex-col overflow-auto">
					{filteredSettingsMetadata.map((section) => (
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
								<Icon source={PolarisChevronRightIcon} tone="subdued" />
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
}
