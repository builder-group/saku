import { Text } from '@shopify/polaris';
import type { ReactNode } from 'react';
import { cn } from '@/lib/ui';

export const StepLayout: React.FC<TStepLayoutProps> = (props) => {
	const { children, icon, title, description, className, contentClassName, ...divProps } = props;

	return (
		<div
			className={cn(
				'flex w-full flex-col items-center bg-[#f1f1f1] px-3 pt-8 pb-12 text-center md:px-8 md:pt-20',
				className
			)}
			{...divProps}
		>
			<div className="flex w-full max-w-sm flex-col items-center">
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
			</div>

			<div className={cn('mt-8 w-full max-w-sm', contentClassName)}>{children}</div>
		</div>
	);
};

interface TStepLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	icon?: React.ReactNode;
	title: ReactNode;
	description: ReactNode;
	contentClassName?: string;
}
