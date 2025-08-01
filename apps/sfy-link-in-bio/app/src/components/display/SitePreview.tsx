import React from 'react';
import { cn } from '../../lib';

export const SitePreview: React.FC<TSitePreviewProps> = (props) => {
	const { url, content, className, disableUrlClick = false, ...divProps } = props;

	return (
		<div
			className={cn('relative flex h-72 items-center justify-center overflow-hidden', className)}
			{...divProps}
		>
			{/* Desktop Preview */}
			<div className="absolute top-0 left-0 w-[calc(100%-5rem)]">
				<div className="rounded-xl bg-gray-800 p-2 pb-5 shadow-xl">
					{/* Browser Chrome */}
					<div className="flex h-7 items-center rounded-t-lg bg-gray-100 px-2">
						{/* Traffic Lights */}
						<div className="mr-4 flex gap-1.5">
							<div className="h-2.5 w-2.5 rounded-full bg-red-500" />
							<div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
							<div className="h-2.5 w-2.5 rounded-full bg-green-500" />
						</div>
						{/* Address Bar */}
						<div className="flex h-4 flex-1 items-center justify-center overflow-hidden rounded bg-white">
							{disableUrlClick ? (
								<span className="min-w-0 truncate px-2 text-center text-xs text-gray-500">
									{url}
								</span>
							) : (
								<a
									className="min-w-0 truncate px-2 text-center text-xs text-gray-500 hover:underline"
									href={url}
									target="_blank"
									rel="noopener noreferrer"
								>
									{url}
								</a>
							)}
						</div>
					</div>

					{/* Browser Content */}
					<div className="relative h-72 overflow-hidden rounded-b-lg bg-white">
						<div
							className="h-full w-full origin-top-left scale-45"
							style={{
								width: '222%',
								height: '222%'
							}}
						>
							{content}
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Preview */}
			<div className="absolute top-12 right-0 w-44">
				<div className="rounded-3xl border-4 border-gray-800 bg-gray-800 p-1 shadow-xl">
					{/* Screen */}
					<div className="relative h-80 overflow-hidden rounded-2xl bg-white">
						<div
							className="h-full w-full origin-top-left scale-42"
							style={{
								width: '238%',
								height: '238%'
							}}
						>
							{content}
						</div>
					</div>

					{/* Home Indicator */}
					<div className="flex justify-center pt-2">
						<div className="h-1 w-8 rounded-full bg-gray-300" />
					</div>
				</div>
			</div>
		</div>
	);
};

interface TSitePreviewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
	url: string;
	content: React.ReactNode;
	disableUrlClick?: boolean;
}

export const IframeContent: React.FC<TIframeContentProps> = (props) => {
	const { url } = props;

	return (
		<iframe
			src={`${url}?preview=true`}
			title="Site Preview"
			className="h-full w-full border-0"
			loading="lazy"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		/>
	);
};

interface TIframeContentProps {
	url: string;
}
