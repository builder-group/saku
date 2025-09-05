import { Collapsible, Icon, Text } from '@shopify/polaris';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../lib';
import { PolarisChevronDownIcon } from '../display';

export const AccordionSection = React.forwardRef<HTMLDivElement, TAccordionSectionProps>(
	(
		{
			title,
			children,
			onToggle,
			open: controlledIsOpen,
			defaultOpen = false,
			className,
			collapsibleClassName,
			size = 'default',
			...divProps
		},
		ref
	) => {
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
			<>
				<div
					ref={ref}
					className={cn(accordionVariants({ size }), isOpen && 'bg-neutral-100', className)}
					onClick={handleToggle}
					role="button"
					tabIndex={0}
					aria-expanded={isOpen}
					{...divProps}
				>
					<Text as="h3" variant="headingSm">
						{title}
					</Text>
					<span
						className="ml-2 transition-transform duration-200"
						style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
					>
						<Icon source={PolarisChevronDownIcon} tone="subdued" />
					</span>
				</div>
				<Collapsible open={isOpen} id={`accordion-section-${title.replace(/\s+/g, '-')}`}>
					<div className={cn(collapsibleVariants({ size }), collapsibleClassName)}>{children}</div>
				</Collapsible>
			</>
		);
	}
);
AccordionSection.displayName = 'AccordionSection';

export interface TAccordionSectionProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof accordionVariants> {
	title: string;
	open?: boolean;
	defaultOpen?: boolean;
	onToggle?: (open: boolean) => void;
	collapsibleClassName?: string;
}

const accordionVariants = cva(
	'flex cursor-pointer items-center justify-between border-b border-neutral-200 px-4 py-3 hover:bg-neutral-50',
	{
		variants: {
			size: {
				default: 'px-4 py-3',
				tight: 'px-4 py-1.5'
			}
		},
		defaultVariants: {
			size: 'default'
		}
	}
);

const collapsibleVariants = cva('border-b border-neutral-200', {
	variants: {
		size: {
			default: 'px-4 py-3',
			tight: 'px-4 py-3'
		}
	},
	defaultVariants: {
		size: 'default'
	}
});
