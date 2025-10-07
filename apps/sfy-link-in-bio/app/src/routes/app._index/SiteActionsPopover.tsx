import { Popover, Text } from '@shopify/polaris';
import React from 'react';

export const SiteActionsPopover: React.FC<TSiteActionsPopoverProps> = (props) => {
	const { activator, site, onCustomize, onRemove } = props;
	const [popoverActive, setPopoverActive] = React.useState(false);

	// =========================================================================
	// Events
	// =========================================================================

	const togglePopover = React.useCallback(() => {
		setPopoverActive((active) => !active);
	}, []);

	const handleView = React.useCallback(() => {
		window.open(site.primaryUrl, '_blank', 'noopener,noreferrer');
		setPopoverActive(false);
	}, [site.primaryUrl]);

	const handleCustomize = React.useCallback(() => {
		onCustomize();
		setPopoverActive(false);
	}, [onCustomize]);

	const handleDelete = React.useCallback(() => {
		onRemove();
		setPopoverActive(false);
	}, [onRemove]);

	// =========================================================================
	// UI
	// =========================================================================

	const wrappedActivator = React.cloneElement(activator as React.ReactElement, {
		onClick: togglePopover
	});

	return (
		<Popover
			active={popoverActive}
			activator={wrappedActivator}
			autofocusTarget="first-node"
			onClose={togglePopover}
		>
			<div className="flex flex-col gap-2 p-2">
				<button
					className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-neutral-50"
					onClick={handleView}
				>
					<Text as="span" variant="bodyMd">
						View
					</Text>
				</button>
				<button
					className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-neutral-50"
					onClick={handleCustomize}
				>
					<Text as="span" variant="bodyMd">
						Customize
					</Text>
				</button>
				<button
					className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-red-50"
					onClick={handleDelete}
				>
					<Text as="span" variant="bodyMd" tone="critical">
						Delete
					</Text>
				</button>
			</div>
		</Popover>
	);
};

interface TSiteActionsPopoverProps {
	activator: React.ReactNode;
	site: {
		primaryUrl: string;
	};
	onCustomize: () => void;
	onRemove: () => void;
}
