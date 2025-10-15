import React from 'react';
import { cn } from '@/lib';

export const ContentEditorSkeleton: React.FC<TContentSkeletonProps> = (props) => {
	const { className } = props;

	return (
		<div className={cn('space-y-3 px-4', className)}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="h-4 w-20 animate-pulse rounded bg-neutral-300"></div>
			</div>

			{/* URL Field */}
			<div className="space-y-1">
				<div className="h-3 w-8 animate-pulse rounded bg-neutral-300"></div>
				<div className="h-8 w-full animate-pulse rounded bg-neutral-300"></div>
			</div>

			{/* Additional Fields */}
			<div className="space-y-1">
				<div className="h-3 w-16 animate-pulse rounded bg-neutral-300"></div>
				<div className="h-8 w-full animate-pulse rounded bg-neutral-300"></div>
			</div>

			<div className="space-y-1">
				<div className="h-3 w-12 animate-pulse rounded bg-neutral-300"></div>
				<div className="h-8 w-full animate-pulse rounded bg-neutral-300"></div>
			</div>
		</div>
	);
};

interface TContentSkeletonProps {
	className?: string;
}
