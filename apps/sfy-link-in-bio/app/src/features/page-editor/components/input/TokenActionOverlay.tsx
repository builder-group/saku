import { Tooltip } from '@shopify/polaris';
import React from 'react';
import { ArrowRightIcon, Badge, LinkOffIcon } from '@/components';

export const TokenActionOverlay: React.FC<TTokenActionOverlayProps> = (props) => {
	const { variant = 'badge', tooltipContent, onUnlink, onNavigateToToken } = props;

	const content = React.useCallback(() => {
		switch (variant) {
			case 'full-overlay':
				return (
					<div className="absolute inset-0 z-50 hidden overflow-hidden rounded-lg group-hover:flex">
						<button
							type="button"
							onClick={onUnlink}
							className="flex flex-1 cursor-pointer items-center justify-center gap-1 bg-orange-100 text-xs text-orange-700 transition-colors hover:bg-orange-200"
						>
							<LinkOffIcon className="h-3 w-3" />
							Unlink
						</button>
						<div className="w-px bg-neutral-300" />

						<button
							type="button"
							onClick={onNavigateToToken}
							className="flex flex-1 cursor-pointer items-center justify-center gap-1 bg-blue-100 text-xs text-blue-700 transition-colors hover:bg-blue-200"
						>
							Token
							<ArrowRightIcon className="h-3 w-3" />
						</button>
					</div>
				);
			case 'badge':
				return (
					<div className="absolute inset-y-0 right-1 z-50 hidden items-center group-hover:flex">
						<Badge className="overflow-hidden p-0">
							<div className="flex">
								<button
									type="button"
									onClick={onUnlink}
									className="flex cursor-pointer items-center gap-1 bg-orange-100 px-2 py-1 text-xs text-orange-700 transition-colors hover:bg-orange-200"
								>
									<LinkOffIcon className="h-3 w-3" />
									Unlink
								</button>
								<div className="w-px bg-gray-300" />
								<button
									type="button"
									onClick={onNavigateToToken}
									className="flex cursor-pointer items-center gap-1 bg-blue-100 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200"
								>
									Token
									<ArrowRightIcon className="h-3 w-3" />
								</button>
							</div>
						</Badge>
					</div>
				);
			case 'separate-badges':
				return (
					<div className="absolute inset-y-0 right-0 z-50 hidden items-center gap-1 pr-2 group-hover:flex">
						<Badge asChild variant="warning">
							<button
								type="button"
								onClick={onUnlink}
								className="cursor-pointer transition-colors hover:bg-[rgba(255,184,0,1)] hover:text-[rgba(37,26,0,1)]"
							>
								<LinkOffIcon className="h-3 w-3" />
								Unlink
							</button>
						</Badge>
						<Badge asChild variant="info">
							<button
								type="button"
								onClick={onNavigateToToken}
								className="cursor-pointer transition-colors hover:bg-[rgba(145,208,255,1)] hover:text-[rgba(0,33,51,1)]"
							>
								Token
								<ArrowRightIcon className="h-3 w-3" />
							</button>
						</Badge>
					</div>
				);
			default:
				return null;
		}
	}, [variant, onUnlink, onNavigateToToken]);

	return tooltipContent != null ? (
		<Tooltip content={tooltipContent} width="wide" preferredPosition="below">
			{content()}
		</Tooltip>
	) : (
		content()
	);
};

interface TTokenActionOverlayProps {
	variant?: 'badge' | 'separate-badges' | 'full-overlay';
	tooltipContent?: React.ReactNode;
	onUnlink?: () => void;
	onNavigateToToken?: () => void;
}

export const TokenKeyTooltip: React.FC<TTokenKeyTooltipProps> = (props) => {
	const { tokenKey } = props;

	return (
		<div className="flex items-center gap-1">
			<span>Token:</span>
			<code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-gray-800">
				{tokenKey}
			</code>
		</div>
	);
};

interface TTokenKeyTooltipProps {
	tokenKey: string;
}
