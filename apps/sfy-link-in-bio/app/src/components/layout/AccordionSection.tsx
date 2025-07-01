import { Collapsible, Icon, Text } from '@shopify/polaris';
import React from 'react';
import { cn } from '../../lib';
import { ChevronDownIcon } from '../display';

export const AccordionSection: React.FC<AccordionSectionProps> = (props) => {
	const { title, children, onToggle, open: controlledIsOpen, defaultOpen = true } = props;
	const isControlled = React.useMemo(() => controlledIsOpen != null, [controlledIsOpen]);
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
	const isOpen = React.useMemo(
		() => (isControlled ? (controlledIsOpen as boolean) : internalOpen),
		[isControlled, controlledIsOpen, internalOpen]
	);

	const handleToggle = React.useCallback(() => {
		if (isControlled && onToggle != null) {
			onToggle(!isOpen);
		} else {
			setInternalOpen((prev) => !prev);
		}
	}, [isControlled, onToggle, isOpen]);

	return (
		<div>
			<div
				className={cn(
					'flex cursor-pointer items-center justify-between border-b border-neutral-200 px-4 py-3 hover:bg-neutral-50',
					isOpen && 'bg-neutral-100'
				)}
				onClick={handleToggle}
				role="button"
				tabIndex={0}
				aria-expanded={isOpen}
			>
				<Text as="h3" variant="headingSm">
					{title}
				</Text>
				<span
					className="ml-2 transition-transform duration-200"
					style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
				>
					<Icon source={ChevronDownIcon} tone="subdued" />
				</span>
			</div>
			<Collapsible open={isOpen} id={`accordion-section-${title.replace(/\s+/g, '-')}`}>
				<div className="border-b border-neutral-200 px-4 py-4">{children}</div>
			</Collapsible>
		</div>
	);
};

export interface AccordionSectionProps {
	title: string;
	children: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onToggle?: (open: boolean) => void;
}
