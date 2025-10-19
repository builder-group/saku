import React from 'react';
import { LogoIcon, useIframePortal } from '@/components';
import { useBoundingRectObserver } from '@/hooks';
import { cn } from '@/lib';

export const Watermark: React.FC<TWatermarkProps> = (props) => {
	const { className } = props;

	const iframePortal = useIframePortal();
	const [isAtBottom, setIsAtBottom] = React.useState(false);
	const watermarkContainerRef = React.useRef<HTMLDivElement>(null);

	useBoundingRectObserver(
		watermarkContainerRef,
		{ top: 0 },
		(rect) => {
			const w = iframePortal?.window ?? window;
			setIsAtBottom(rect.top < w.innerHeight);
		},
		[iframePortal],
		() => iframePortal?.window ?? window
	);

	return (
		<div
			ref={watermarkContainerRef}
			className={cn('flex min-h-12 items-center justify-center', className)}
		>
			<a
				href="https://saku.so"
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					'flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-sm text-black no-underline shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/100 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95',
					{ 'fixed right-4 bottom-4 z-[999]': !isAtBottom }
				)}
			>
				<LogoIcon className="h-6 w-6" />
				<span>Made in Saku</span>
			</a>
		</div>
	);
};

interface TWatermarkProps {
	className?: string;
}
