import React from 'react';
import { ClipboardCheckIcon, ShareIcon } from '@/components';
import { logger } from '@/environment';
import { cn } from '@/lib';

export const ShareButton: React.FC<TShareButtonProps> = (props) => {
	const { hasScrolled } = props;

	const [isCopied, setIsCopied] = React.useState(false);
	const [isDisabled, setIsDisabled] = React.useState(false);

	const handleClick = React.useCallback(async () => {
		if (isDisabled) {
			return;
		}

		try {
			await navigator.clipboard.writeText(window.location.href);

			setIsCopied(true);
			setIsDisabled(true);
			setTimeout(() => {
				setIsCopied(false);
				setIsDisabled(false);
			}, 2000);
		} catch {
			logger.error('Failed to copy link');
		}
	}, [isDisabled]);

	return (
		<button
			className={cn(
				'flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 text-black backdrop-blur-sm transition-all duration-200',
				{
					'shadow-[0_2px_8px_rgba(0,0,0,0.15)]': !hasScrolled,
					'cursor-pointer hover:scale-105 hover:bg-white focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95':
						!isDisabled,
					'cursor-not-allowed opacity-70': isDisabled,
					'bg-green-100 hover:bg-green-100': isCopied
				}
			)}
			aria-label={isCopied ? 'Copied!' : 'Copy profile link'}
			onClick={handleClick}
			disabled={isDisabled}
		>
			{isCopied ? <ClipboardCheckIcon className="h-4 w-4" /> : <ShareIcon className="h-4 w-4" />}
		</button>
	);
};

interface TShareButtonProps {
	hasScrolled: boolean;
}
