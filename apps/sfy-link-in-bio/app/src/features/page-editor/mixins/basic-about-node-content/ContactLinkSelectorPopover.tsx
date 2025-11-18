import { contactMetadataMap } from '@repo/editor';
import { Popover, Text } from '@shopify/polaris';
import React from 'react';
import { contactIconMap } from '../../environment';

export const ContactLinkSelectorPopover: React.FC<TContactLinkSelectorPopoverProps> = (props) => {
	const { activator, onSelect, availableKeys, width } = props;
	const [popoverActive, setPopoverActive] = React.useState(false);

	// =========================================================================
	// Events
	// =========================================================================

	const togglePopover = React.useCallback(() => {
		setPopoverActive((active) => !active);
	}, []);

	const handleSelect = React.useCallback(
		(key: keyof typeof contactMetadataMap) => {
			onSelect(key);
			setPopoverActive(false);
		},
		[onSelect]
	);

	const wrappedActivator = React.cloneElement(activator as React.ReactElement, {
		onClick: togglePopover
	});

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<Popover
			active={popoverActive}
			activator={wrappedActivator}
			autofocusTarget="first-node"
			onClose={togglePopover}
		>
			<div className="flex flex-col gap-2 p-2" style={width != null ? { width } : undefined}>
				{availableKeys.map((key) => {
					const metadata = contactMetadataMap[key];
					const IconComponent = contactIconMap[key];

					return (
						<button
							key={key}
							className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-neutral-50"
							onClick={() => handleSelect(key)}
						>
							{IconComponent != null && <IconComponent className="h-4 w-4" />}
							<Text as="span" variant="bodyMd">
								{metadata.label}
							</Text>
						</button>
					);
				})}
			</div>
		</Popover>
	);
};

interface TContactLinkSelectorPopoverProps {
	activator: React.ReactNode;
	onSelect: (key: keyof typeof contactMetadataMap) => void;
	availableKeys: Array<keyof typeof contactMetadataMap>;
	width?: number;
}
