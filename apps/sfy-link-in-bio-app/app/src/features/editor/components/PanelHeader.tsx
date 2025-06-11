import React from 'react';
import { cn } from '@/lib';

export const PanelHeader: React.FC<TPanelHeaderProps> = (props) => {
	const { children, className, ...divProps } = props;

	return (
		<div
			className={cn('flex h-12 items-center border-b border-neutral-200 bg-white px-6', className)}
			{...divProps}
		>
			{children}
		</div>
	);
};

interface TPanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}
