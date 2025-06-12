'use client';

import { shortId } from '@blgc/utils';
import { Icon, Popover, Text } from '@shopify/polaris';
import React from 'react';
import { useResizeObserver } from '@/hooks';
import { blocksMetadataMap, TBlockType } from '../../environment';
import { TEditor } from '../../lib';

export const BlockSelectorPopover: React.FC<TBlockSelectorPopoverProps> = (props) => {
	const { editor, activator, width = 'auto' } = props;
	const [popoverActive, setPopoverActive] = React.useState(false);
	const [activatorWidth, setActivatorWidth] = React.useState<number>();
	const activatorRef = React.useRef<HTMLDivElement>(null);

	const blocksMetadata = React.useMemo(() => {
		return Object.values(blocksMetadataMap);
	}, []);

	// =========================================================================
	// Events
	// =========================================================================

	const togglePopover = React.useCallback(() => {
		setPopoverActive((active) => !active);
	}, []);

	const handleBlockSelect = React.useCallback(
		(blockType: TBlockType) => {
			editor.addBlock({
				id: shortId(),
				type: blockType
			});

			setPopoverActive(false);
		},
		[editor]
	);

	// =========================================================================
	// Effects
	// =========================================================================

	useResizeObserver(activatorRef, () => {
		if (width === 'activator' && activatorRef.current != null) {
			setActivatorWidth(activatorRef.current.offsetWidth);
		}
	}, [width]);

	// =========================================================================
	// UI
	// =========================================================================

	const popoverWidth = React.useMemo(() => {
		switch (width) {
			case 'auto':
				return undefined;
			case 'activator':
				return activatorWidth;
			default:
				return width;
		}
	}, [width, activatorWidth]);

	const wrappedActivator = React.cloneElement(activator as React.ReactElement, {
		onClick: togglePopover,
		ref: activatorRef
	});

	return (
		<Popover
			active={popoverActive}
			activator={wrappedActivator}
			autofocusTarget="first-node"
			onClose={togglePopover}
		>
			<div className="p-2" style={{ width: popoverWidth }}>
				<div className="flex flex-col gap-2">
					{blocksMetadata.map((blockMetadata) => (
						<div
							key={blockMetadata.type}
							className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-neutral-50"
							onClick={() => handleBlockSelect(blockMetadata.type as TBlockType)}
						>
							<div>
								<Icon source={blockMetadata.icon} />
							</div>
							<Text as="span" variant="bodyMd">
								{blockMetadata.label}
							</Text>
						</div>
					))}
				</div>
			</div>
		</Popover>
	);
};

interface TBlockSelectorPopoverProps {
	editor: TEditor;
	activator: React.ReactNode;
	width?: 'auto' | 'activator' | number;
}
