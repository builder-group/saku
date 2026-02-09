import { Button, Icon, Text } from '@shopify/polaris';
import { useFeatureState, withLocalStorage } from 'feature-react';
import { createState } from 'feature-state';
import React from 'react';
import { PersistableBanner, PolarisPaintBrushFlatIcon } from '@/components';
import { appConfig } from '@/environment';
import { TNodeState, TPageEditor } from '../../../../../lib';
import { NodeStyleEditor } from '../../../../node';

export const StyleTab: React.FC<TStyleTabProps> = (props) => {
	const { nodeState, editor } = props;

	const hasSeenState = React.useMemo(
		() =>
			withLocalStorage(
				createState(false),
				appConfig.localStorageKey('style-tab_has-seen-layer-guide')
			),
		[]
	);
	const hasSeen = useFeatureState(hasSeenState);

	// =========================================================================
	// Events
	// =========================================================================

	const handleGoToSettings = React.useCallback(() => {
		editor.switchView({ type: 'settings', view: { type: 'design', tab: 1 } });
	}, [editor]);

	const handleStyleThisLayer = React.useCallback(() => {
		hasSeenState.set(true);
	}, [hasSeenState]);

	// =========================================================================
	// Effects
	// =========================================================================

	React.useEffect(() => {
		hasSeenState.persist();
	}, [hasSeenState]);

	// =========================================================================
	// UI
	// =========================================================================

	if (!hasSeen) {
		return (
			<div className="flex h-full flex-col bg-white p-6 text-left">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
					<Icon source={PolarisPaintBrushFlatIcon} />
				</div>
				<div className="mb-2">
					<Text variant="headingMd" as="h3">
						Change one layer or your whole page?
					</Text>
				</div>
				<div className="mb-4">
					<Text variant="bodyMd" tone="subdued" as="p">
						Here you change how this layer looks. To change colors, fonts, and layout for your whole
						page, go to{' '}
						<button
							type="button"
							onClick={handleGoToSettings}
							className="inline cursor-pointer underline hover:no-underline"
							aria-label="Navigate to Settings &gt; Customize"
						>
							Settings &gt; Customize
						</button>{' '}
						instead.
					</Text>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="primary" onClick={handleGoToSettings}>
						Go to Settings
					</Button>
					<Button variant="secondary" onClick={handleStyleThisLayer}>
						Style this layer
					</Button>
				</div>
			</div>
		);
	}

	return (
		<>
			<PersistableBanner storageKey="style-tab_show-info-banner" tone="info" className="p-2">
				You&apos;re changing this layer only. To change your whole page, go to{' '}
				<button
					type="button"
					onClick={handleGoToSettings}
					className="inline cursor-pointer underline hover:no-underline"
					aria-label="Navigate to Settings &gt; Customize"
				>
					Settings &gt; Customize
				</button>
			</PersistableBanner>
			<NodeStyleEditor nodeState={nodeState} editor={editor} />
		</>
	);
};

interface TStyleTabProps {
	nodeState: TNodeState;
	editor: TPageEditor;
}
