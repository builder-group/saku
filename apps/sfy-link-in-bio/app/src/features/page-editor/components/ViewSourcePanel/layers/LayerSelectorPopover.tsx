'use client';

import { deepCopy } from '@blgc/utils';
import { createId, TFlatNode } from '@repo/editor';
import { Icon, Popover, Text } from '@shopify/polaris';
import React from 'react';
import { useResizeObserver } from '@/hooks';
import { nodeMetadata, nodeMetadataMap } from '../../../environment';
import { TPageEditor } from '../../../lib';

export const LayerSelectorPopover: React.FC<TLayerSelectorPopoverProps> = (props) => {
	const { editor, activator, width = 'auto' } = props;
	const [popoverActive, setPopoverActive] = React.useState(false);
	const [activatorWidth, setActivatorWidth] = React.useState<number>();
	const activatorRef = React.useRef<HTMLDivElement>(null);

	// =========================================================================
	// Events
	// =========================================================================

	const togglePopover = React.useCallback(() => {
		setPopoverActive((active) => !active);
	}, []);

	const handleLayerSelect = React.useCallback(
		(layerType: TFlatNode['type']) => {
			const nodeMetadata = nodeMetadataMap[layerType];
			if (nodeMetadata.internal) {
				return;
			}

			const nodeId = editor.addNode({
				id: createId('node'),
				type: layerType,
				...deepCopy(nodeMetadata.defaultData)
			} as TFlatNode);
			editor.selectNode(nodeId);

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
					{nodeMetadata
						.filter((nodeMetadata) => !nodeMetadata.internal)
						.filter((nodeMetadata) => !nodeMetadata.hidden)
						.map((nodeMetadata) => (
							<div
								key={nodeMetadata.type}
								className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-neutral-50"
								onClick={() => handleLayerSelect(nodeMetadata.type)}
							>
								<div>
									<Icon source={nodeMetadata.icon} />
								</div>
								<Text as="span" variant="bodyMd">
									{nodeMetadata.label}
								</Text>
							</div>
						))}
				</div>
			</div>
		</Popover>
	);
};

interface TLayerSelectorPopoverProps {
	editor: TPageEditor;
	activator: React.ReactNode;
	width?: 'auto' | 'activator' | number;
}
