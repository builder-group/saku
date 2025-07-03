import { Text } from '@shopify/polaris';
import type { ReactNode } from 'react';
import { cn } from '@/lib/ui';

export const StepLayout: React.FC<TStepLayoutProps> = (props) => {
	const { children, icon, title, description, className, contentClassName, ...divProps } = props;

	return (
		<div
			className={cn(
				'relative mx-auto flex w-full max-w-sm flex-col items-center px-3 pt-8 pb-16 text-center md:px-8 md:pt-20',
				className
			)}
			{...divProps}
		>
			{icon != null && (
				<div className="rounded-full border border-neutral-200 bg-white p-2.5">{icon}</div>
			)}

			<div className="mt-4">
				<Text as="h1" variant="heading2xl" alignment="center">
					{title}
				</Text>
			</div>

			<div className="mt-1.5">
				<Text as="p" variant="bodyLg" tone="subdued" alignment="center">
					{description}
				</Text>
			</div>

			<div className={cn('mt-8 w-full', contentClassName)}>{children}</div>
		</div>
	);
};

interface TStepLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	icon?: React.ReactNode;
	title: ReactNode;
	description: ReactNode;
	contentClassName?: string;
}
