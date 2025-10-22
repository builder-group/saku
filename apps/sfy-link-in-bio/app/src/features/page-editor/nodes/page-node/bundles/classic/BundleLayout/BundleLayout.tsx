import React from 'react';
import { LogoIcon, useIframePortal } from '@/components';
import { useHasScrolled } from '@/hooks';
import { cn } from '@/lib';
import { TResolvedPageNode } from '../../../types';
import { resolveFooterActionToLink } from './resolve-footer-action-to-link';
import { ShareButton } from './ShareButton';
import { Watermark } from './Watermark';

export const ClassicBundleLayout = React.forwardRef<HTMLDivElement, TClassicBundleLayout>(
	(props, ref) => {
		const {
			node: { watermarkVisible, content, autoLayout, appearance, fill, textCaption },
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

		// =========================================================================
		// UI
		// =========================================================================

		return (
			<>
				{/* Navbar */}
				{content.navbar.visible && (
					<div
						className={cn(
							'fixed top-2 right-0 left-0 z-[200] mx-auto w-full max-w-xl px-2 sm:px-4',
							{
								'sm:top-[length:var(--header-top-scrolled)]': hasScrolled,
								'sm:absolute sm:top-[length:var(--header-top)]': !hasScrolled
							}
						)}
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
									aria-label="Visit Saku website"
								>
									<LogoIcon className="h-6 w-6" />
								</a>
							)}

							{content.navbar.shareButtonVisible && <ShareButton hasScrolled={hasScrolled} />}
						</div>
					</div>
				)}

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
								className="overflow-hidden rounded-t-none pb-16 sm:rounded-t-[length:var(--content-radius)] sm:shadow-[0_24px_32px_0px_rgba(0,0,0,0.15)]"
								style={{
									...appearance.styles,
									...fill?.styles
								}}
							>
								<div className="flex w-full flex-col" style={autoLayout.styles}>
									{children}
								</div>

								{/* Footer */}
								<div className="space-y-8 pt-16">
									{watermarkVisible && <Watermark />}

									{content.footer.visible && content.footer.links.length > 0 && (
										<div className="flex justify-center gap-6 text-sm">
											{content.footer.links.map((link) => {
												const { href, target } = resolveFooterActionToLink(link.action);

												return (
													<a
														key={link.id}
														href={href}
														target={target}
														rel={target === '_blank' ? 'noopener noreferrer' : undefined}
														style={textCaption.styles}
													>
														{link.label}
													</a>
												);
											})}
										</div>
									)}
								</div>
							</div>

							{/* Glass border overlay */}
							<div className="pointer-events-none absolute top-0 left-0 -mt-[length:var(--glass-border-width)] -ml-[length:var(--glass-border-width)] hidden h-full w-[calc(100%+var(--glass-border-width)*2)] rounded-t-none border-t-[length:var(--glass-border-width)] border-r-[length:var(--glass-border-width)] border-l-[length:var(--glass-border-width)] border-solid border-white/40 sm:block sm:rounded-t-[length:var(--glass-border-radius)]" />
						</div>
					</div>
				</div>
			</>
		);
	}
);
ClassicBundleLayout.displayName = 'ClassicBundleLayout';

interface TClassicBundleLayout extends React.HTMLAttributes<HTMLDivElement> {
	node: Omit<TResolvedPageNode, 'children'>;
	children: React.ReactNode;
}
