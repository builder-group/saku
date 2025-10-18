import React from 'react';
import { LogoIcon, ShareIcon, useIframePortal } from '@/components';
import { appConfig } from '@/environment';
import { useHasScrolled, useIsAtBottom } from '@/hooks';
import { cn } from '@/lib';
import { TResolvedPageNode } from '../../types';

export const BundleLayout = React.forwardRef<HTMLDivElement, TBundleLayout>((props, ref) => {
	const {
		node: { watermarkVisible, autoLayout, appearance, fill },
		children,
		...divProps
	} = props;

	const {
		contentRadius,
		glassBorderRadius,
		borderWidth,
		contentTop,
		headerTop,
		headerTopScrolled,
		scrollThreshold
	} = React.useMemo(() => {
		const contentRadius = 8;
		const borderWidth = 5;
		const contentTop = 40;
		const headerTop = contentTop + 16;
		const headerTopScrolled = 8;
		return {
			contentRadius,
			glassBorderRadius: contentRadius + borderWidth,
			borderWidth,
			contentTop,
			headerTop,
			headerTopScrolled,
			scrollThreshold: headerTop - headerTopScrolled
		};
	}, []);

	const iframePortal = useIframePortal();
	const hasScrolled = useHasScrolled(scrollThreshold, () => iframePortal?.window ?? window);
	const isAtBottom = useIsAtBottom(
		128,
		() => iframePortal?.window ?? window,
		() => iframePortal?.document ?? document
	);

	return (
		<div className="relative">
			{/* Header */}
			<div
				className={cn('fixed top-2 right-0 left-0 z-[200] mx-auto w-full max-w-xl px-2 sm:px-4', {
					'sm:top-[length:var(--header-top-scrolled)]': hasScrolled,
					'sm:absolute sm:top-[length:var(--header-top)]': !hasScrolled
				})}
				style={{
					['--header-top' as string]: `${headerTop}px`,
					['--header-top-scrolled' as string]: `${headerTopScrolled}px`
				}}
			>
				<div
					className={cn('relative flex items-center rounded-xl p-2', {
						'justify-between': watermarkVisible,
						'justify-end': !watermarkVisible
					})}
				>
					{/* Glass background */}
					<div
						className={cn(
							'absolute inset-0 -z-10 rounded-xl border border-white/20 bg-white/20 backdrop-blur-[20px] transition-all duration-300 ease-out',
							{
								'scale-100 opacity-100 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]': hasScrolled,
								'scale-[0.96] opacity-0': !hasScrolled
							}
						)}
					/>

					{watermarkVisible && (
						<a
							href="https://saku.so"
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/70 text-black backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/100 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95',
								{ 'shadow-[0_2px_8px_rgba(0,0,0,0.15)]': !hasScrolled }
							)}
						>
							<LogoIcon className="h-6 w-6" />
						</a>
					)}

					<button
						className={cn(
							'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/70 text-black backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/100 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95',
							{ 'shadow-[0_2px_8px_rgba(0,0,0,0.15)]': !hasScrolled }
						)}
						aria-label="Share profile"
					>
						<ShareIcon className="h-4 w-4" />
					</button>
				</div>
			</div>

			<div
				{...divProps}
				ref={ref}
				className="relative w-full overflow-x-hidden"
				style={{
					...appearance.styles,
					...fill?.styles,
					['--content-top' as string]: `${contentTop}px`,
					['--content-radius' as string]: `${contentRadius}px`,
					['--glass-border-radius' as string]: `${glassBorderRadius}px`,
					['--glass-border-width' as string]: `${borderWidth}px`
				}}
			>
				{/* Background blur */}
				<div className="absolute inset-0 hidden bg-black/10 backdrop-blur-xl sm:block" />

				{/* Main content container */}
				<div className="relative mx-auto w-full max-w-xl sm:pt-[length:var(--content-top)]">
					<div className="relative">
						{/* Content area */}
						<div
							className="overflow-hidden rounded-t-none sm:rounded-t-[length:var(--content-radius)] sm:shadow-[0_24px_32px_0px_rgba(0,0,0,0.15)]"
							style={{
								...appearance.styles,
								...fill?.styles
							}}
						>
							<div className="flex w-full flex-col" style={autoLayout.styles}>
								{children}
							</div>

							{/* Footer */}
							<div
								className={cn('flex justify-center gap-6 pb-16 text-sm', {
									'pt-32': watermarkVisible,
									'pt-16': !watermarkVisible
								})}
							>
								<a
									href={`mailto:${appConfig.help.email}?subject=Report Violation`}
									className="text-black/70 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] transition-colors hover:text-black/90"
								>
									Report
								</a>
								<a
									href={appConfig.help.legal.privacy}
									target="_blank"
									rel="noopener noreferrer"
									className="text-black/70 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] transition-colors hover:text-black/90"
								>
									Privacy
								</a>
							</div>
						</div>

						{/* Glass border overlay */}
						<div className="pointer-events-none absolute top-0 left-0 -mt-[length:var(--glass-border-width)] -ml-[length:var(--glass-border-width)] hidden h-full w-[calc(100%+var(--glass-border-width)*2)] rounded-t-none border-t-[length:var(--glass-border-width)] border-r-[length:var(--glass-border-width)] border-l-[length:var(--glass-border-width)] border-solid border-white/40 sm:block sm:rounded-t-[length:var(--glass-border-radius)]" />
					</div>
				</div>
			</div>

			{watermarkVisible && (
				<div
					className={cn('z-[999]', {
						'fixed right-4 bottom-4': !isAtBottom,
						'absolute bottom-32 left-1/2 -translate-x-1/2': isAtBottom
					})}
				>
					<a
						href="https://saku.so"
						target="_blank"
						rel="noopener noreferrer"
						className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-sm text-black no-underline shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/100 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95"
					>
						<LogoIcon className="h-6 w-6" />
						<span>Made in Saku</span>
					</a>
				</div>
			)}
		</div>
	);
});
BundleLayout.displayName = 'PageWrapper';

interface TBundleLayout extends React.HTMLAttributes<HTMLDivElement> {
	node: Omit<TResolvedPageNode, 'children'>;
	children: React.ReactNode;
}
