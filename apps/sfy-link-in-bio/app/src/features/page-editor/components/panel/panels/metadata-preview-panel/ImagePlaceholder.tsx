import React from 'react';
import { PolarisImageIcon } from '@/components';
import { cn } from '@/lib';

export const ImagePlaceholder: React.FC<TImagePlaceholderProps> = (props) => {
	const { className = 'aspect-[1200/630]', iconClassName } = props;

	return (
		<div className={cn('flex items-center justify-center bg-neutral-100', className)}>
			<PolarisImageIcon className={cn('h-10 w-10 fill-neutral-400', iconClassName)} />
		</div>
	);
};

interface TImagePlaceholderProps {
	className?: string;
	iconClassName?: string;
}
